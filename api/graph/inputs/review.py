from typing import Optional
import strawberry

@strawberry.input
class ReviewInput:
    content: str
    song_id: strawberry.ID
    artist_id: strawberry.ID

@strawberry.input
class ReviewUpdateInput:
    content: Optional[str] = None
    song_id: Optional[strawberry.ID] = None
    artist_id: Optional[strawberry.ID] = None 