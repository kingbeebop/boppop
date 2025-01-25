from typing import Optional, List, Annotated
from datetime import datetime
from strawberry.types import Info
from strawberry import field
from strawberry import type as strawberry_type
from strawberry.scalars import ID

@strawberry_type
class Artist:
    """Represents a user/artist in the system."""
    id: ID
    username: str
    email: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # from .song import Song
    # @field
    # async def songs(self, info: Info) -> List['Song']:
    #     """Get all songs created by this artist."""
    #     from models.song import Song as SongModel
    #     from sqlalchemy import select
    #     from db.session import get_db
        
    #     db = next(get_db())
    #     result = await db.execute(
    #         select(SongModel)
    #         .where(SongModel.artist_id == self.id)
    #         .order_by(SongModel.created_at.desc())
    #     )
    #     return result.scalars().all()

@strawberry_type
class ArtistInput:
    username: str
    email: str
    password: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None

@strawberry_type
class ArtistUpdateInput:
    username: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    profile_pic: Optional[str] = None