import logging
from typing import Optional, Union
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers, IntegerIDMixin
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from db.session import get_db
from models.user import User
from models.artist import Artist
from schemas.auth import UserCreate, UserUpdate
from core.config import settings
from fastapi_users.exceptions import InvalidPasswordException, UserAlreadyExists

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = settings.JWT_SECRET
    verification_token_secret = settings.JWT_SECRET

    async def on_after_register(
        self, user: User, request: Optional[Request] = None
    ) -> None:
        print(f"User {user.id} has registered.")
        try:
            async with AsyncSession() as session:
                # Create associated artist
                artist = Artist(
                    name=user.username,
                    user_id=user.id
                )
                session.add(artist)
                await session.commit()
                logger.info(f"Created artist for user {user.id}")
        except Exception as e:
            logger.error(f"Error creating artist for user {user.id}: {str(e)}")
            raise

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        print(f"Verification requested for user {user.id}. Token: {token}")

    async def create(
        self,
        user_create: UserCreate,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> User:
        """Create a user and associated artist profile."""
        
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise UserAlreadyExists()

        # Create user dict
        user_dict = (
            user_create.create_update_dict()
            if safe
            else user_create.create_update_dict_superuser()
        )
        user_dict["username"] = user_create.username
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)

        # Get database session
        db = self.user_db.session

        try:
            # Create user
            user = User(**user_dict)
            db.add(user)
            await db.flush()

            # Create associated artist
            artist = Artist(
                name=user_create.username,
                user_id=user.id
            )
            db.add(artist)
            
            await db.commit()
            await db.refresh(user)
            
            logger.info(f"Created user {user.id}")
            return user
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error creating user: {str(e)}")
            raise

    async def validate_password(
        self,
        password: str,
        user: Union[UserCreate, User],
    ) -> None:
        await super().validate_password(password, user)
        if isinstance(user, UserCreate):
            if len(password) < 8:
                raise InvalidPasswordException(
                    reason="Password must be at least 8 characters"
                )
            if not any(c.isupper() for c in password):
                raise InvalidPasswordException(
                    reason="Password must contain at least one uppercase letter"
                )
            if not any(c.isdigit() for c in password):
                raise InvalidPasswordException(
                    reason="Password must contain at least one number"
                )

    async def update(
        self,
        user_update: UserUpdate,
        user: User,
        safe: bool = False,
        request: Optional[Request] = None
    ) -> User:
        # If username is being updated, check if it's unique
        if user_update.username:
            async with self.user_db.session as session:
                stmt = select(Artist).where(
                    Artist.name == user_update.username,
                    Artist.user_id != user.id
                )
                result = await session.execute(stmt)
                if result.scalar_one_or_none():
                    raise UserAlreadyExists("Username already exists")

        # If email is being updated, check if it's unique
        if user_update.email:
            async with self.user_db.session as session:
                stmt = select(User).where(
                    User.email == user_update.email,
                    User.id != user.id
                )
                result = await session.execute(stmt)
                if result.scalar_one_or_none():
                    raise UserAlreadyExists("Email already exists")

        # Update the user
        updated_user = await super().update(user_update, user, safe, request)

        # If username was updated, update the artist name too
        if user_update.username:
            async with self.user_db.session as session:
                stmt = select(Artist).where(Artist.user_id == user.id)
                result = await session.execute(stmt)
                artist = result.scalar_one()
                if artist:
                    artist.name = user_update.username
                    await session.commit()
                    await session.refresh(artist)

        return updated_user

async def get_user_db(session: AsyncSession = Depends(get_db)):
    yield SQLAlchemyUserDatabase(session, User)

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

bearer_transport = BearerTransport(tokenUrl="api/auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.JWT_SECRET,
        lifetime_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)