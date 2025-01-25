from typing import Optional, Annotated
from datetime import datetime
from .artist import Artist
from strawberry.types import Info
from strawberry import field
from strawberry import type as strawberry_type
from strawberry.scalars import ID

@strawberry_type
class Song:
    """Represents a song in the system."""
    id: ID
    title: str
    url: str
    artist_id: ID
    playlist_id: ID
    created_at: datetime
    updated_at: datetime

    @field
    async def artist(self, info: Info) -> 'Artist':
        """Get the artist who created this song."""
        from models.artist import Artist as ArtistModel
        from sqlalchemy import select
        from db.session import get_db
        
        db = next(get_db())
        result = await db.execute(
            select(ArtistModel)
            .where(ArtistModel.id == self.artist_id)
        )
        return result.scalar_one()

@strawberry_type
class SongInput:
    title: str
    url: str
    artist_id: ID
    playlist_id: ID

@strawberry_type
class SongUpdateInput:
    title: Optional[str] = None
    url: Optional[str] = None
    playlist_id: Optional[ID] = None