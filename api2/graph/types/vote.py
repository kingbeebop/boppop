from typing import Optional
from datetime import datetime
import strawberry
from strawberry import type as strawberry_type
from strawberry.scalars import ID
from .artist import ArtistRef
from .song import Song
from .playlist import PlaylistRef

@strawberry.type
class Vote:
    id: strawberry.ID
    song_id: strawberry.ID
    artist_id: strawberry.ID
    playlist_id: strawberry.ID
    created_at: datetime
    updated_at: datetime
    song: Song
    artist: ArtistRef
    playlist: PlaylistRef
    comments: Optional[str] = None

    @classmethod
    def from_db(cls, vote_model):
        """Convert a database model to a GraphQL type."""
        if not vote_model:
            return None
            
        return cls(
            id=strawberry.ID(str(vote_model.id)),
            song_id=strawberry.ID(str(vote_model.song_id)),
            artist_id=strawberry.ID(str(vote_model.artist_id)),
            playlist_id=strawberry.ID(str(vote_model.playlist_id)),
            created_at=vote_model.created_at,
            updated_at=vote_model.updated_at,
            song=Song.from_db(vote_model.song),
            artist=ArtistRef.from_db(vote_model.artist),
            playlist=PlaylistRef.from_db(vote_model.playlist),
            comments=vote_model.comments
        )

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

@strawberry.input
class BallotInput:
    """Input type for submitting a vote."""
    song_id: strawberry.ID
    comments: Optional[str] = None