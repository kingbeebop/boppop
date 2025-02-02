from typing import Optional
from sqlalchemy import select
from models.user import User
from core.security import get_password_hash
from ..types import User as UserType
from strawberry.types import Info

async def register(
    email: str,
    username: str,
    password: str,
    info: Info
) -> Optional[UserType]:
    """Register a new user."""
    session = await info.context.get_session()
    async with session.begin():
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
        await session.commit()
        
        return UserType.from_db(user) 