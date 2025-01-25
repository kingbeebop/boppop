from typing import Optional
from datetime import date
import strawberry

@strawberry.input
class PlaylistInput:
    number: int
    theme: str
    date: date
    active: bool = True
    contest: bool = False
    winner_id: Optional[strawberry.ID] = None

@strawberry.input
class PlaylistUpdateInput:
    number: Optional[int] = None
    theme: Optional[str] = None
    date: Optional[date] = None
    active: Optional[bool] = None
    contest: Optional[bool] = None
    winner_id: Optional[strawberry.ID] = None 