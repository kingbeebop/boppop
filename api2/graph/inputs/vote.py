from typing import Optional
import strawberry

@strawberry.input
class VoteInput:
    song_id: strawberry.ID
    artist_id: strawberry.ID
    playlist_id: strawberry.ID

@strawberry.input
class VoteUpdateInput:
    song_id: Optional[strawberry.ID] = None
    artist_id: Optional[strawberry.ID] = None
    playlist_id: Optional[strawberry.ID] = None 