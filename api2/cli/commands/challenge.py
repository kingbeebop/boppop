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
    async def _start_contest():
        async with async_session_maker() as session:
            challenge = await get_current_challenge(session)
            if not challenge:
                click.echo("No active challenge found")
                return
                
            challenge.contest = True
            await session.commit()
            click.echo(f"Contest started for challenge #{challenge.number}")
    
    asyncio.run(_start_contest())

@challenge.command()
def end_contest():
    """End the current contest and create a new challenge."""
    async def _end_contest():
        async with async_session_maker() as session:
            # Get current challenge
            challenge = await get_current_challenge(session)
            if not challenge:
                click.echo("No active challenge found")
                return

            # Get vote counts for songs in this challenge
            vote_counts = await session.execute(
                select(Vote.song_id, func.count(Vote.id).label('vote_count'))
                .where(Vote.playlist_id == challenge.id)
                .group_by(Vote.song_id)
            )
            vote_counts = vote_counts.all()

            if not vote_counts:
                click.echo("No votes found")
                return

            # Find max vote count
            max_votes = max(count for _, count in vote_counts)
            
            # Get all songs with max votes
            top_songs = [song_id for song_id, count in vote_counts if count == max_votes]
            
            # Randomly select winner from top songs
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
            
            # Get winner details for output
            winner = await session.execute(
                select(Song).where(Song.id == winner_id)
            )
            winner = winner.scalar_one()
            
            click.echo(f"Contest ended for challenge #{challenge.number}")
            click.echo(f"Winner: {winner.title} by {winner.artist.name}")
            click.echo(f"New challenge #{new_challenge.number} created")
    
    asyncio.run(_end_contest())

if __name__ == '__main__':
    challenge() 