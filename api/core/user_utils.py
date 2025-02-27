from sqlalchemy.ext.asyncio import AsyncSession
from models import User, Artist
import logging

logger = logging.getLogger(__name__)

async def ensure_user_has_artist(session: AsyncSession, user: User) -> None:
    """Ensure a user has an associated artist profile."""
    if not user.artist:
        artist = Artist(
            name=user.username,
            user_id=user.id
        )
        session.add(artist)
        await session.flush()
        logger.info(f"Created artist profile for user {user.username}") 