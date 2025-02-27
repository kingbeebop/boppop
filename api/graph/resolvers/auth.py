from typing import Optional
from sqlalchemy import select
from models.user import User
from core.security import get_password_hash
from core.user_utils import ensure_user_has_artist
from ..types import User as UserType
from strawberry.types import Info
from sqlalchemy.exc import IntegrityError

async def register(
    email: str,
    username: str,
    password: str,
    info: Info
) -> Optional[UserType]:
    """Register a new user and create associated artist profile."""
    session = await info.context.get_session()
    async with session.begin():
        try:
            # Check if user already exists
            existing = await session.execute(
                select(User).where(
                    (User.email == email) | (User.username == username)
                )
            )
            if existing.scalar_one_or_none():
                raise ValueError("User with this email or username already exists")

            # Create new user
            user = User(
                email=email,
                username=username,
                hashed_password=get_password_hash(password),
                is_active=True
            )
            session.add(user)
            await session.flush()  # Flush to get the user.id
            
            # Create artist profile
            await ensure_user_has_artist(session, user)
            await session.commit()
            
            return UserType.from_db(user)
        except IntegrityError as e:
            await session.rollback()
            if "ix_users_username" in str(e):
                raise ValueError("This username is already taken")
            elif "ix_users_email" in str(e):
                raise ValueError("This email is already registered")
            else:
                raise ValueError("An error occurred during registration") 