import logging
from typing import Optional, Union
from fastapi import Depends, Request, HTTPException, Security, APIRouter
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
from fastapi.security import OAuth2PasswordRequestForm, HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.exc import IntegrityError
import re
from datetime import timedelta, datetime, timezone

from db.session import get_session
from models.user import User
from models.artist import Artist
from schemas.auth import UserCreate, UserUpdate
from core.config import settings
from core.security import create_access_token
from fastapi_users.exceptions import InvalidPasswordException, UserAlreadyExists
from .auth import get_user_manager

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()  # Add this at the top

async def get_user_db(session: AsyncSession = Depends(get_session)):
    """Get a SQLAlchemy user database instance."""
    yield SQLAlchemyUserDatabase(session, User)

class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = settings.JWT_SECRET
    verification_token_secret = settings.JWT_SECRET

    async def get_by_username(self, username: str) -> Optional[User]:
        """Get a user by username."""
        query = select(User).where(User.username == username)
        result = await self.user_db.session.execute(query)
        return result.scalar_one_or_none()

    async def authenticate(self, credentials: OAuth2PasswordRequestForm) -> Optional[User]:
        """Authenticate a user with username/password."""
        try:
            # First try email
            user = await self.user_db.get_by_email(credentials.username)
            if not user:
                # Then try username
                user = await self.get_by_username(credentials.username)
                if not user:
                    # Hash password anyway to prevent timing attacks
                    self.password_helper.hash(credentials.password)
                    return None

            verified, updated_hash = self.password_helper.verify_and_update(
                credentials.password, user.hashed_password
            )
            if not verified:
                return None

            if updated_hash:
                await self.user_db.update(user, {"hashed_password": updated_hash})

            return user
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} registered successfully")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ) -> None:
        print(f"Verification requested for user {user.id}. Verification token: {token}")

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
        if existing_user:
            raise UserAlreadyExists()

        user_dict = user_create.create_update_dict_superuser()
        user_dict["username"] = user_create.username
        user_dict["hashed_password"] = self.password_helper.hash(user_dict.pop("password"))

        # Get current time for timestamps
        now = datetime.now(timezone.utc)

        async with self.user_db.session as session:
            try:
                user = User(**user_dict)
                session.add(user)
                await session.flush()

                artist = Artist(
                    name=user_create.username,
                    user_id=user.id,
                    created_at=now,
                    updated_at=now
                )
                session.add(artist)
                
                await session.commit()
                await session.refresh(user)
                return user
            except Exception as e:
                await session.rollback()
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

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

class AccessTokenStrategy(JWTStrategy):
    """Strategy for short-lived access tokens."""
    def __init__(self):
        super().__init__(
            secret=settings.JWT_SECRET,
            lifetime_seconds=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            token_audience=["fastapi-users:auth"],
            algorithm="HS256",
        )

class RefreshTokenStrategy(JWTStrategy):
    """Strategy for long-lived refresh tokens."""
    def __init__(self):
        super().__init__(
            secret=settings.JWT_SECRET,
            lifetime_seconds=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            token_audience=["fastapi-users:refresh"],
            algorithm="HS256",
        )

# Update the auth backends
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=BearerTransport(tokenUrl="auth/jwt/login"),
    get_strategy=AccessTokenStrategy,
)

refresh_backend = AuthenticationBackend(
    name="jwt-refresh",
    transport=BearerTransport(tokenUrl="auth/jwt/refresh"),
    get_strategy=RefreshTokenStrategy,
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)

async def get_user_with_artist(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(current_active_user)
) -> Optional[User]:
    """Get current user with artist relationship eagerly loaded."""
    if not user:
        return None
        
    stmt = (
        select(User)
        .options(selectinload(User.artist))
        .where(User.id == user.id)
    )
    result = await session.execute(stmt)
    return result.scalar_one()

# Add this new security scheme
security = HTTPBearer(auto_error=False)

async def get_optional_user(
    session: AsyncSession = Depends(get_session),
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Optional[User]:
    """Get current user without requiring authentication."""
    if not credentials:
        return None
        
    try:
        token = credentials.credentials
        strategy = AccessTokenStrategy()  # Use the access token strategy
        user_id = await strategy.read_token(token)
        if not user_id:
            return None
            
        user = await session.get(User, int(user_id))
        if not user or not user.is_active:
            return None
            
        return user
    except Exception:
        return None

async def optional_user_with_artist(
    session: AsyncSession = Depends(get_session),
    user: Optional[User] = Depends(get_optional_user)
) -> Optional[User]:
    """Get current user with artist relationship eagerly loaded, but don't require auth."""
    if not user:
        return None
        
    stmt = (
        select(User)
        .options(selectinload(User.artist))
        .where(User.id == user.id)
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

# Make sure these settings are in core/config.py
JWT_SECRET = settings.JWT_SECRET
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = settings.JWT_EXPIRE_MINUTES

@router.post("/auth/jwt/refresh")
async def refresh_token(
    refresh_token: str = Depends(refresh_backend.get_strategy),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Refresh access token using refresh token."""
    try:
        user = await refresh_backend.get_strategy().read_token(refresh_token)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
        # Generate new access token
        access_token = await auth_backend.get_strategy().write_token(user)
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@router.post("/auth/login")
async def login(
    credentials: OAuth2PasswordRequestForm = Depends(),
    user_manager: UserManager = Depends(get_user_manager),
):
    """Login endpoint that returns both access and refresh tokens."""
    user = await user_manager.authenticate(credentials)
    if not user:
        raise HTTPException(status_code=400, detail="LOGIN_BAD_CREDENTIALS")
        
    # Generate both tokens
    access_strategy = AccessTokenStrategy()
    refresh_strategy = RefreshTokenStrategy()
    
    access_token = await access_strategy.write_token(user)
    refresh_token = await refresh_strategy.write_token(user)
    
    response = {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token
    }
    
    return response

# JWT Strategy
def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.JWT_SECRET,
        lifetime_seconds=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

__all__ = [
    "router",
    "auth_backend",
    "fastapi_users",
    "current_active_user",
    "current_superuser"
]