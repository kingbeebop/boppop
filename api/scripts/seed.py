from typing import List
import logging
from datetime import datetime, timezone, date
from sqlalchemy import select
from db.session import async_session_maker
from models.user import User
from models.artist import Artist
from models.song import Song
from models.playlist import Playlist
from core.security import get_password_hash

logger = logging.getLogger(__name__)

def now() -> datetime:
    """Get current UTC datetime."""
    return datetime.now(timezone.utc)

async def seed_database():
    """Seed the database with initial data."""
    try:
        async with async_session_maker() as session:
            # Create superusers - artists will be created by event listeners
            superusers = [
                User(
                    email="bop@boppop.com",
                    username="Bop",
                    hashed_password=get_password_hash("BigTime123"),
                    is_active=True,
                    is_verified=True,
                    is_superuser=True
                ),
                User(
                    email="mel@boppop.com",
                    username="Mel",
                    hashed_password=get_password_hash("BigTime123"),
                    is_active=True,
                    is_verified=True,
                    is_superuser=True
                )
            ]
            
            # Add users and commit to trigger event listeners
            session.add_all(superusers)
            await session.commit()

            # Get the created artists
            artists = []
            for user in superusers:
                result = await session.execute(
                    select(Artist).where(Artist.user_id == user.id)
                )
                artist = result.scalar_one()
                artists.append(artist)

            # Create test songs
            songs = [
                Song(
                    title=f"Test Song {i}",
                    url=f"https://soundcloud.com/artist{artist.id}/song{i}",
                    artist_id=artist.id,
                    created_at=now(),
                    updated_at=now()
                )
                for artist in artists
                for i in range(1, 4)  # 3 songs per artist
            ]
            session.add_all(songs)
            await session.flush()

            # Create test playlists
            playlists = [
                Playlist(
                    number=i,
                    theme=f"Test Theme {i}",
                    date=date(2024, 1, i),
                    active=i == 1,  # Only first playlist is active
                    contest=True,
                    created_at=now(),
                    updated_at=now()
                )
                for i in range(1, 4)  # Create 3 playlists
            ]
            session.add_all(playlists)
            
            await session.commit()
            logger.info("Database seeded successfully")

    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}")
        await session.rollback()
        raise

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_database())