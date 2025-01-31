from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordRequestForm, HTTPAuthorizationCredentials, HTTPBearer
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime
import logging
import jwt

from .config import settings
from models.user import User
from db.session import get_session

router = APIRouter(prefix="/auth", tags=["auth"])

logger = logging.getLogger(__name__)

class AccessTokenStrategy(JWTStrategy):
    """Strategy for short-lived access tokens."""
    def __init__(self):
        super().__init__(
            secret=settings.JWT_SECRET,
            lifetime_seconds=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            token_audience=["fastapi-users:auth"],
            algorithm="HS256",
        )

    async def read_token(self, token: str) -> Optional[str]:
        try:
            payload = jwt.decode(
                token,
                self.secret,
                audience=self.token_audience,
                algorithms=[self.algorithm],
            )
            return payload.get("sub")
        except jwt.PyJWTError as e:
            logger.error(f"Token validation error: {str(e)}")
            return None

class RefreshTokenStrategy(JWTStrategy):
    """Strategy for long-lived refresh tokens."""
    def __init__(self):
        super().__init__(
            secret=settings.JWT_SECRET,
            lifetime_seconds=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            token_audience=["fastapi-users:refresh"],
            algorithm="HS256",
        )

# Auth backends
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

# Security schemes
security = HTTPBearer(auto_error=False)

async def get_optional_user(
    session: AsyncSession = Depends(get_session),
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Optional[User]:
    """Get current user without requiring authentication."""
    if not credentials:
        logger.debug("No credentials provided")
        return None
        
    try:
        token = credentials.credentials
        logger.debug(f"Validating token: {token[:20]}...")
        
        strategy = AccessTokenStrategy()
        user_id = await strategy.read_token(token)
        logger.debug(f"Token validation result - user_id: {user_id}")
        
        if not user_id:
            logger.debug("No user_id from token")
            return None
            
        user = await session.get(User, int(user_id))
        logger.debug(f"Found user: {user.id if user else None}")
        
        if not user or not user.is_active:
            logger.debug("User not found or not active")
            return None
            
        return user
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return None

async def optional_user_with_artist(
    session: AsyncSession = Depends(get_session),
    user: Optional[User] = Depends(get_optional_user)
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
    return result.scalar_one_or_none()

@router.post("/refresh")
async def refresh_token(
    refresh_token: str = Depends(refresh_backend.get_strategy),
):
    """Refresh access token using refresh token."""
    try:
        user = await refresh_backend.get_strategy().read_token(refresh_token)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
        access_token = await auth_backend.get_strategy().write_token(user)
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token") 