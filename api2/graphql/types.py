import strawberry
from typing import List, Optional, Generic, TypeVar
from datetime import datetime, date

T = TypeVar("T")

@strawberry.type
class Artist:
    id: int
    username: str
    email: str
    bio: Optional[str]
    profile_pic: Optional[str]
    created_at: datetime
    updated_at: datetime

@strawberry.type
class Song:
    id: int
    title: str
    url: str
    artist_id: int
    playlist_id: int
    created_at: datetime
    updated_at: datetime

@strawberry.type
class Playlist:
    id: int
    number: int
    theme: str
    date: date
    active: bool
    contest: bool
    winner_id: Optional[int]
    created_at: datetime
    updated_at: datetime

@strawberry.type
class Review:
    id: int
    content: str
    song_id: int
    artist_id: int
    created_at: datetime
    updated_at: datetime

@strawberry.type
class Vote:
    id: int
    song_id: int
    artist_id: int
    playlist_id: int
    created_at: datetime
    updated_at: datetime

@strawberry.type
class PageInfo:
    has_next_page: bool
    has_previous_page: bool
    total_pages: int
    total_items: int
    current_page: int

@strawberry.type
class PaginatedResponse(Generic[T]):
    items: List[T]
    page_info: PageInfo

@strawberry.type
class ArtistSubscription:
    artist: Artist
    action: str  # "created", "updated", "deleted"

@strawberry.type
class SongSubscription:
    song: Song
    action: str

@strawberry.type
class PlaylistSubscription:
    playlist: Playlist
    action: str

@strawberry.type
class VoteSubscription:
    vote: Vote
    action: str 