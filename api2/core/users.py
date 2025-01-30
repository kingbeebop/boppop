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
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
import re

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

    async def authenticate(self, credentials: OAuth2PasswordRequestForm) -> Optional[User]:
        """Override the authenticate method to use username instead of email"""
        try:
            # Query by username instead of email
            async with self.user_db.session as session:
                query = select(User).where(User.username == credentials.username)
                result = await session.execute(query)
                user = result.scalar_one_or_none()

            if not user:
                # Run password hash to prevent timing attacks
                self.password_helper.hash(credentials.password)
                return None

            verified, updated_password_hash = self.password_helper.verify_and_update(
                credentials.password, user.hashed_password
            )

            if not verified:
                return None

            # Update password hash if needed
            if updated_password_hash is not None:
                await self.user_db.update(user, {"hashed_password": updated_password_hash})

            return user

        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return None

    async def on_after_register(
        self, user: User, request: Optional[Request] = None
    ) -> None:
        print(f"User {user.id} has registered.")
        logger.info(f"User {user.id} registration completed")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        print(f"Verification requested for user {user.id}. Token: {token}")

    async def _generate_unique_artist_name(self, session: AsyncSession, base_name: str) -> str:
        """Generate a unique artist name by appending numbers if necessary."""
        # First try the base name
        query = select(Artist).where(Artist.name == base_name)
        result = await session.execute(query)
        if not result.scalar_one_or_none():
            return base_name

        # If base name exists, find all similar names with numbers
        pattern = f"^{re.escape(base_name)}\\d*$"
        query = select(Artist).where(Artist.name.regexp_match(pattern))
        result = await session.execute(query)
        existing_names = [artist.name for artist in result.scalars().all()]

        if not existing_names:
            return f"{base_name}1"

        # Find the highest number used
        max_num = 0
        for name in existing_names:
            suffix = name[len(base_name):]
            if suffix.isdigit():
                max_num = max(max_num, int(suffix))

        # Return next number in sequence
        return f"{base_name}{max_num + 1}"

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
            await db.flush()  # Flush to get user.id

            # Check if user already has an artist
            query = select(Artist).where(Artist.user_id == user.id)
            result = await db.execute(query)
            existing_artist = result.scalar_one_or_none()

            if not existing_artist:
                # Generate unique artist name
                artist_name = await self._generate_unique_artist_name(db, user_create.username)

                # Create associated artist
                artist = Artist(
                    name=artist_name,
                    user_id=user.id
                )
                db.add(artist)
                
                logger.info(f"Created artist {artist_name} for user {user.id}")
            else:
                logger.info(f"User {user.id} already has artist {existing_artist.name}")
            
            await db.commit()
            await db.refresh(user)
            
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

    async def get_with_artist(self, user_id: int) -> Optional[User]:
        """Get user with artist relationship loaded"""
        async with AsyncSession() as session:
            stmt = (
                select(User)
                .options(selectinload(User.artist))
                .filter(User.id == user_id)
            )
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

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