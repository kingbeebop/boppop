import asyncio
import logging
from datetime import date
from sqlalchemy import text
from db.session import AsyncSessionLocal
from models import User, Artist, Song, Playlist
from core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TEST_SOUNDCLOUD_URL = "https://soundcloud.com/user-872282317/daylight-r0bbery"

async def seed_database():
    async with AsyncSessionLocal() as session:
        # Check if we have any users
        result = await session.execute(text("SELECT COUNT(*) FROM users"))
        user_count = result.scalar()
        
        if user_count == 0:
            # Create test users
            test_user1 = User(
                email="test1@example.com",
                username="testuser1",
                hashed_password=get_password_hash("password123"),
                is_active=True,
                is_superuser=False,
                is_verified=True,
            )
            session.add(test_user1)
            
            test_user2 = User(
                email="test2@example.com",
                username="testuser2",
                hashed_password=get_password_hash("password123"),
                is_active=True,
                is_superuser=False,
                is_verified=True,
            )
            session.add(test_user2)
            
            # Create test artists
            test_artist1 = Artist(
                name="Test Artist One",
                bio="First test artist for development",
                user=test_user1
            )
            session.add(test_artist1)

            test_artist2 = Artist(
                name="Test Artist Two",
                bio="Second test artist for development",
                user=test_user2
            )
            session.add(test_artist2)

            # Create test playlists
            playlist1 = Playlist(
                number=1,
                theme="Past Theme",
                date=date(2024, 1, 1),
                active=False,
                contest=False,
            )
            session.add(playlist1)
            
            playlist2 = Playlist(
                number=2,
                theme="Current Theme",
                date=date(2024, 2, 1),
                active=True,
                contest=False,
            )
            session.add(playlist2)

            # Create songs for first artist
            song1_artist1 = Song(
                title="First Song by Artist One",
                url=TEST_SOUNDCLOUD_URL,
                artist=test_artist1,
            )
            session.add(song1_artist1)
            
            song2_artist1 = Song(
                title="Second Song by Artist One",
                url=TEST_SOUNDCLOUD_URL,
                artist=test_artist1,
            )
            session.add(song2_artist1)

            # Create songs for second artist
            song1_artist2 = Song(
                title="First Song by Artist Two",
                url=TEST_SOUNDCLOUD_URL,
                artist=test_artist2,
            )
            session.add(song1_artist2)
            
            song2_artist2 = Song(
                title="Second Song by Artist Two",
                url=TEST_SOUNDCLOUD_URL,
                artist=test_artist2,
            )
            session.add(song2_artist2)

            # Associate songs with playlists
            playlist1.songs = [song1_artist1, song1_artist2]  # First songs go to first playlist
            playlist2.songs = [song2_artist1, song2_artist2]  # Second songs go to second playlist
            
            await session.commit()
            logger.info("Database seeded successfully with:")
            logger.info("- 2 users created")
            logger.info("- 2 artists created")
            logger.info("- 4 songs created (2 per artist)")
            logger.info("- 2 playlists created (1 inactive, 1 active)")
        else:
            logger.info("Database already contains data, skipping seed")

if __name__ == "__main__":
    asyncio.run(seed_database())