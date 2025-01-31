from typing import Optional
import strawberry
from strawberry.scalars import ID

@strawberry.input
class SongSubmissionInput:
    """Input type for submitting a song to the current playlist."""
    title: str
    url: str

@strawberry.input
class SongInput:
    """Input type for creating a new song."""
    title: str
    url: str
    artist_id: ID
    playlist_id: ID

@strawberry.input
class SongUpdateInput:
    """Input type for updating an existing song."""
    title: Optional[str] = None
    url: Optional[str] = None
    artist_id: Optional[ID] = None
    playlist_id: Optional[ID] = None 