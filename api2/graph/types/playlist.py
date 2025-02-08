import strawberry
from typing import Optional, List
from datetime import datetime
from strawberry.scalars import ID
from models.playlist import Playlist as PlaylistModel
from .pagination import Connection, Edge, PageInfo

@strawberry.type
class Playlist:
    """Represents a playlist/challenge."""
    id: ID
    number: int
    theme: str
    date: datetime
    active: bool
    contest: bool
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")
    song_ids: List[ID] = strawberry.field(name="songIds")

    @classmethod
    def from_db(cls, db_playlist: PlaylistModel) -> "Playlist":
        """Convert database model to GraphQL type."""
        return cls(
            id=ID(str(db_playlist.id)),
            number=db_playlist.number,
            theme=db_playlist.theme,
            date=db_playlist.date,
            active=db_playlist.active,
            contest=db_playlist.contest,
            created_at=db_playlist.created_at,
            updated_at=db_playlist.updated_at,
            song_ids=[ID(str(song.id)) for song in db_playlist.songs]
        )

# Use generic types
PlaylistEdge = Edge[Playlist]
PlaylistConnection = Connection[Playlist]

@strawberry.input
class PlaylistFilter:
    active: Optional[bool] = None
    contest: Optional[bool] = None

@strawberry.type
class PlaylistRef:
    """A simplified playlist reference."""
    id: ID
    theme: str
    active: bool
    contest: bool

    @classmethod
    def from_db(cls, playlist_model):
        if not playlist_model:
            return None
        return cls(
            id=ID(str(playlist_model.id)),
            theme=playlist_model.theme,
            active=playlist_model.active,
            contest=playlist_model.contest
        )

__all__ = [
    "Playlist",
    "PlaylistFilter",
    "PlaylistEdge",
    "PlaylistConnection"
] 