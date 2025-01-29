from typing import Optional
from datetime import datetime
from .artist import Artist
from strawberry.types import Info
from strawberry import field
from strawberry import type as strawberry_type
from strawberry.scalars import ID
import strawberry
from models.song import Song as SongModel

@strawberry_type
class Song:
    """Represents a song in the system."""
    id: ID
    title: str
    url: str
    artist_id: ID = strawberry.field(name="artistId")
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")

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

    @classmethod
    def from_db(cls, song: SongModel) -> "Song":
        return cls(
            id=str(song.id),
            title=song.title,
            url=song.url,
            artist_id=str(song.artist_id),
            created_at=song.created_at,
            updated_at=song.updated_at
        )

@strawberry_type
class SongInput:
    title: str
    url: str
    artist_id: ID

@strawberry_type
class SongUpdateInput:
    title: Optional[str] = None
    url: Optional[str] = None