from typing import Optional
from datetime import datetime
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
    artist_name: str = strawberry.field(name="artistName")
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")

    @classmethod
    def from_db(cls, song: SongModel) -> "Song":
        return cls(
            id=str(song.id),
            title=song.title,
            url=song.url,
            artist_id=str(song.artist_id),
            artist_name=song.artist.name if song.artist else "",
            created_at=song.created_at,
            updated_at=song.updated_at
        )