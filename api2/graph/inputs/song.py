from typing import Optional
import strawberry

@strawberry.input
class SongInput:
    title: str
    url: str
    artist_id: strawberry.ID
    playlist_id: strawberry.ID

@strawberry.input
class SongUpdateInput:
    title: Optional[str] = None
    url: Optional[str] = None
    artist_id: Optional[strawberry.ID] = None
    playlist_id: Optional[strawberry.ID] = None 