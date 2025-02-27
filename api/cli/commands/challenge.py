from datetime import datetime, timedelta
import random
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import async_session_maker
from models.playlist import Playlist
from models.vote import Vote
from models.song import Song
import asyncio
import click
from datetime import datetime
import pytz

async def get_current_challenge(session: AsyncSession) -> Playlist:
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

@click.group()
def challenge():
    """Challenge management commands."""
    pass

@challenge.command()
def start_contest():
    """Start the voting contest for the current challenge."""
    from tasks.challenge_tasks import start_contest
    start_contest.delay()
    click.echo("Contest start task scheduled")

@challenge.command()
def end_contest():
    """End the current contest and create a new challenge."""
    from tasks.challenge_tasks import end_contest
    end_contest.delay()
    click.echo("Contest end task scheduled")

if __name__ == '__main__':
    challenge() 