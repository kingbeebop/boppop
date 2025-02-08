from typing import Optional, List
from datetime import datetime
from enum import Enum
from strawberry.scalars import ID
import strawberry
from models.song import Song as SongModel
from .pagination import Connection, Edge, PageInfo
from .artist import SortDirection, ArtistRef, Artist

@strawberry.enum
class SongSortField(Enum):
    CREATED_AT = "created_at"
    TITLE = "title"

@strawberry.type
class Song:
    """Represents a song entry."""
    id: ID
    title: str
    url: str
    artist_id: ID
    artist: ArtistRef
    artist_name: str
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")

    @classmethod
    def from_db(cls, song_model):
        """Convert a database model to a GraphQL type."""
        if not song_model:
            return None
            
        artist = song_model.artist
        return cls(
            id=ID(str(song_model.id)),
            title=song_model.title,
            url=song_model.url,
            artist_id=ID(str(song_model.artist_id)),
            artist=ArtistRef.from_db(artist),
            artist_name=artist.name if artist else "",
            created_at=song_model.created_at,
            updated_at=song_model.updated_at
        )

@strawberry.type
class SongEdge:
    node: Song
    cursor: str

@strawberry.type
class SongConnection:
    edges: List[SongEdge]
    page_info: PageInfo

@strawberry.input
class SongFilter:
    artist_id: Optional[ID] = None
    search: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    sort_direction: Optional[SortDirection] = None