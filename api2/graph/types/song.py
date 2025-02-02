from typing import Optional, List
from datetime import datetime
from strawberry import field
from strawberry import type as strawberry_type
from strawberry.scalars import ID
import strawberry
from models.song import Song as SongModel
from .pagination import Connection, Edge

@strawberry.type
class Song:
    """Represents a song entry."""
    id: ID
    title: str
    url: str
    artist_id: ID = strawberry.field(name="artistId")
    artist_name: str = strawberry.field(name="artistName")
    playlist_id: Optional[ID] = strawberry.field(name="playlistId")
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")

    @classmethod
    def from_db(cls, db_song: SongModel) -> "Song":
        """Convert database model to GraphQL type."""
        return cls(
            id=ID(str(db_song.id)),
            title=db_song.title,
            url=db_song.url,
            artist_id=ID(str(db_song.artist_id)),
            artist_name=db_song.artist.name if db_song.artist else None,
            playlist_id=ID(str(db_song.playlist_id)) if db_song.playlist_id else None,
            created_at=db_song.created_at,
            updated_at=db_song.updated_at
        )

# Use generic types
SongEdge = Edge[Song]
SongConnection = Connection[Song]

@strawberry.input
class SongFilter:
    artist_id: Optional[ID] = None
    playlist_id: Optional[ID] = None