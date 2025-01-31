from datetime import datetime, timedelta
from typing import Optional, Tuple
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from .config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)

# Token functions
def create_access_token(user_id: int) -> str:
    """Create a new access token."""
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {
            "sub": str(user_id),
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access"
        },
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

def create_refresh_token(user_id: int) -> str:
    """Create a new refresh token."""
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(
        {
            "sub": str(user_id),
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh"
        },
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

def verify_token(token: str) -> Optional[int]:
    """Verify JWT token and return user ID if valid."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        if payload.get("type") not in ["access", "refresh"]:
            return None
        return int(payload.get("sub"))
    except (jwt.ExpiredSignatureError, InvalidTokenError, ValueError) as e:
        print(f"Token verification error: {e}")
        return None

def create_tokens(user_id: int) -> Tuple[str, str]:
    """Create both access and refresh tokens."""
    return create_access_token(user_id), create_refresh_token(user_id)