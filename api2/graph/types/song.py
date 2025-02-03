from typing import Optional, List
from datetime import datetime
from enum import Enum
from strawberry.scalars import ID
import strawberry
from models.song import Song as SongModel
from .pagination import Connection, Edge, PageInfo
from .artist import SortDirection, ArtistRef

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
    artist: ArtistRef
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")

    @classmethod
    def from_db(cls, song: SongModel):
        return cls(
            id=ID(str(song.id)),
            title=song.title,
            url=song.url,
            artist=ArtistRef(
                id=ID(str(song.artist_id)),
                name=song.artist_name
            ),
            created_at=song.created_at,
            updated_at=song.updated_at
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