import asyncio
import logging
from datetime import date
from sqlalchemy import text
from db.session import AsyncSessionLocal
from models import User, Artist, Song, Playlist
from core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_database():
    async with AsyncSessionLocal() as session:
        # Check if we have any users
        result = await session.execute(text("SELECT COUNT(*) FROM users"))
        user_count = result.scalar()
        
        if user_count == 0:
            # Create test user
            test_user = User(
                email="test@example.com",
                username="testuser",
                hashed_password=get_password_hash("password123"),
                is_active=True,
                is_superuser=False,
                is_verified=True,
            )
            session.add(test_user)
            
            # Create test artist
            test_artist = Artist(
                name="Test Artist",
                bio="A test artist for development",
                user=test_user
            )
            session.add(test_artist)
            
            # Create test playlist
            test_playlist = Playlist(
                number=1,
                theme="Test Theme",
                date=date(2024, 1, 1),
                active=True,
                contest=True
            )
            session.add(test_playlist)
            
            # Create test song
            test_song = Song(
                title="Test Song",
                url="https://example.com/song.mp3",
                artist=test_artist
            )
            session.add(test_song)
            
            await session.commit()
            logger.info("Database seeded successfully")
        else:
            logger.info("Database already contains data, skipping seed")

if __name__ == "__main__":
    asyncio.run(seed_database())