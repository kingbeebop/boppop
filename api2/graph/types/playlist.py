from typing import Optional, List
from datetime import datetime, date
from strawberry import type as strawberry_type
from strawberry.scalars import ID
from strawberry.scalars import ID
from .song import Song

@strawberry_type
class Playlist:
    id: ID
    number: int
    theme: str
    date: date
    active: bool
    contest: bool
    winner_id: Optional[ID] = None
    created_at: datetime
    updated_at: datetime
    songs: List[Song]
    winner: Optional[Song] = None

@strawberry_type
class PlaylistInput:
    number: int
    theme: str
    date: date
    active: bool = True
    contest: bool = False
    winner_id: Optional[ID] = None

@strawberry_type
class PlaylistUpdateInput:
    number: Optional[int] = None
    theme: Optional[str] = None
    date: Optional[date] = None
    active: Optional[bool] = None
    contest: Optional[bool] = None
    winner_id: Optional[ID] = None 