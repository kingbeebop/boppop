import strawberry
from typing import Optional
from datetime import date
from enum import Enum

@strawberry.input
class ArtistInput:
    username: str
    email: str
    password: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None

@strawberry.input
class SongInput:
    title: str
    url: str
    artist_id: int
    playlist_id: int

@strawberry.input
class PlaylistInput:
    number: int
    theme: str
    date: date
    active: bool = True
    contest: bool = False
    winner_id: Optional[int] = None

@strawberry.input
class ReviewInput:
    content: str
    song_id: int
    artist_id: int

@strawberry.input
class VoteInput:
    song_id: int
    artist_id: int
    playlist_id: int

@strawberry.input
class PaginationInput:
    page: int = 1
    per_page: int = 10

@strawberry.enum
class SortOrder(Enum):
    ASC = "asc"
    DESC = "desc"

@strawberry.input
class SortInput:
    field: str
    order: SortOrder = SortOrder.ASC

@strawberry.input
class DateRangeInput:
    start_date: Optional[date] = None
    end_date: Optional[date] = None

@strawberry.input
class ArtistFilterInput:
    search: Optional[str] = None
    is_active: Optional[bool] = None

@strawberry.input
class SongFilterInput:
    search: Optional[str] = None
    artist_id: Optional[int] = None
    playlist_id: Optional[int] = None

@strawberry.input
class PlaylistFilterInput:
    search: Optional[str] = None
    date_range: Optional[DateRangeInput] = None
    active: Optional[bool] = None
    contest: Optional[bool] = None 