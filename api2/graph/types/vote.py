from typing import Optional
from datetime import datetime
from strawberry import type as strawberry_type
from strawberry.scalars import ID
from .artist import Artist
from .song import Song
from .playlist import Playlist

@strawberry_type
class Vote:
    id: ID
    song_id: ID
    artist_id: ID
    playlist_id: ID
    created_at: datetime
    updated_at: datetime
    song: Song
    artist: Artist
    playlist: Playlist

@strawberry_type
class VoteInput:
    song_id: ID
    artist_id: ID
    playlist_id: ID

@strawberry_type
class VoteUpdateInput:
    song_id: Optional[ID] = None
    artist_id: Optional[ID] = None
    playlist_id: Optional[ID] = None