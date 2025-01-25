from typing import Optional
from datetime import datetime
from strawberry import type as strawberry_type
from strawberry.scalars import ID
from .artist import Artist
from .song import Song

@strawberry_type
class Review:
    id: ID
    content: str
    song_id: ID
    artist_id: ID
    created_at: datetime
    updated_at: datetime
    song: Song
    artist: Artist

@strawberry_type
class ReviewInput:
    content: str
    song_id: ID
    artist_id: ID

@strawberry_type
class ReviewUpdateInput:
    content: Optional[str] = None
    song_id: Optional[ID] = None
    artist_id: Optional[ID] = None