from core.celery import celery_app
from sqlalchemy import select, func
import random
from datetime import datetime, timedelta
import pytz
from db.session import async_session_maker
from models.playlist import Playlist
from models.vote import Vote
from models.song import Song
import logging
import asyncio

logger = logging.getLogger(__name__)

async def get_current_challenge(session):
    """Get the current active challenge."""
    result = await session.execute(
        select(Playlist)
        .where(Playlist.active == True)
        .order_by(Playlist.created_at.desc())
    )
    return result.scalar_one_or_none()

async def get_next_wednesday_8am() -> datetime:
    """Get next Wednesday at 8am ET."""
    et_tz = pytz.timezone('America/New_York')
    now = datetime.now(et_tz)
    
    # Calculate days until next Wednesday (weekday 2)
    days_ahead = (2 - now.weekday()) % 7
    if days_ahead <= 0:
        days_ahead += 7
        
    next_wednesday = now + timedelta(days=days_ahead)
    next_wednesday = next_wednesday.replace(
        hour=8, 
        minute=0, 
        second=0, 
        microsecond=0
    )
    
    return next_wednesday

@celery_app.task
def start_contest():
    """Start the voting contest for the current challenge."""
    async def _start_contest():
        try:
            async with async_session_maker() as session:
                challenge = await get_current_challenge(session)
                if not challenge:
                    logger.error("No active challenge found")
                    return
                    
                challenge.contest = True
                await session.commit()
                logger.info(f"Contest started for challenge #{challenge.number}")
        except Exception as e:
            logger.error(f"Error starting contest: {str(e)}")
            raise

    return asyncio.run(_start_contest())

@celery_app.task
def end_contest():
    """End the current contest and create a new challenge."""
    async def _end_contest():
        try:
            async with async_session_maker() as session:
                # Get current challenge
                challenge = await get_current_challenge(session)
                if not challenge:
                    logger.error("No active challenge found")
                    return

                # Get vote counts for songs in this challenge
                vote_counts = await session.execute(
                    select(Vote.song_id, func.count(Vote.id).label('vote_count'))
                    .where(Vote.playlist_id == challenge.id)
                    .group_by(Vote.song_id)
                )
                vote_counts = vote_counts.all()

                if not vote_counts:
                    logger.error("No votes found")
                    return

                # Find max vote count and winner
                max_votes = max(count for _, count in vote_counts)
                top_songs = [song_id for song_id, count in vote_counts if count == max_votes]
                winner_id = random.choice(top_songs)
                
                # Update challenge
                challenge.active = False
                challenge.contest = False
                challenge.winner_id = winner_id
                
                # Create new challenge
                next_wednesday = await get_next_wednesday_8am()
                new_challenge = Playlist(
                    number=challenge.number + 1,
                    theme="TBD",  # Theme will be set by winner
                    date=next_wednesday,
                    active=True,
                    contest=False
                )
                
                session.add(new_challenge)
                await session.commit()
                
                # Get winner details for logging
                winner = await session.execute(
                    select(Song).where(Song.id == winner_id)
                )
                winner = winner.scalar_one()
                
                logger.info(f"Contest ended for challenge #{challenge.number}")
                logger.info(f"Winner: {winner.title} by {winner.artist.name}")
                logger.info(f"New challenge #{new_challenge.number} created")
        except Exception as e:
            logger.error(f"Error ending contest: {str(e)}")
            raise

    return asyncio.run(_end_contest()) 