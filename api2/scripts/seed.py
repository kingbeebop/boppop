from typing import List
import asyncio
import logging
from datetime import date, datetime, timezone
from sqlalchemy import select, func
from db.session import async_session_maker
from models.user import User
from models.artist import Artist
from models.song import Song
from models.playlist import Playlist
from core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TEST_SOUNDCLOUD_URLS = [
    "https://soundcloud.com/artist1/song1",
    "https://soundcloud.com/artist1/song2",
    "https://soundcloud.com/artist1/song3",
    "https://soundcloud.com/artist2/song1",
    "https://soundcloud.com/artist2/song2",
    "https://soundcloud.com/artist2/song3",
]

def now() -> datetime:
    """Get current UTC datetime."""
    return datetime.now(timezone.utc)

async def seed_database():
    """Seed the database with initial data."""
    try:
        async with async_session_maker() as session:
            # Check if database already has data
            result = await session.execute(select(func.count()).select_from(User))
            count = result.scalar()
            
            if count > 0:
                logger.info("Database already contains data, skipping seed")
                return

            # Create users
            users = [
                User(
                    email=f"artist{i}@example.com",
                    username=f"artist{i}",
                    hashed_password=get_password_hash("password123"),
                    is_active=True,
                    is_verified=True,
                    created_at=now(),
                    updated_at=now()
                )
                for i in range(1, 3)
            ]
            for user in users:
                session.add(user)

            # Create artists
            artists = [
                Artist(
                    name=f"Test Artist {i}",
                    bio=f"Bio for test artist {i}",
                    user=users[i-1],
                    created_at=now(),
                    updated_at=now()
                )
                for i in range(1, 3)
            ]
            for artist in artists:
                session.add(artist)

            # Create songs (3 per artist)
            songs = []
            for i, artist in enumerate(artists):
                for j in range(3):
                    song = Song(
                        title=f"Song {j+1} by {artist.name}",
                        url=TEST_SOUNDCLOUD_URLS[i*3 + j],
                        artist=artist,
                        created_at=now(),
                        updated_at=now()
                    )
                    songs.append(song)
                    session.add(song)

            # Create playlists with songs
            themes = ["Past Theme", "Second Theme", "Current Contest Theme"]
            for i, theme in enumerate(themes, 1):
                playlist = Playlist(
                    number=i,
                    theme=theme,
                    date=date(2024, i, 1),
                    active=i == 3,
                    contest=i == 3,
                    created_at=now(),
                    updated_at=now()
                )
                # Add one song from each artist to each playlist
                playlist_songs = [
                    songs[0 + (i-1)],  # Song from Artist 1
                    songs[3 + (i-1)]   # Song from Artist 2
                ]
                playlist.songs.extend(playlist_songs)
                session.add(playlist)

            # Commit all changes in a single transaction
            await session.commit()

            logger.info("Database seeded successfully with:")
            logger.info("- 2 users created")
            logger.info("- 2 artists created")
            logger.info("- 6 songs created (3 per artist)")
            logger.info("- 3 playlists created:")
            logger.info("  * 2 past playlists with one song from each artist")
            logger.info("  * 1 active contest playlist with one song from each artist")
    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}")
        await session.rollback()
        raise

if __name__ == "__main__":
    asyncio.run(seed_database())