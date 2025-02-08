import strawberry
from typing import Optional, List
from ..types import (
    Artist, 
    ArtistConnection, 
    ArtistFilter,
    Playlist,
    PlaylistConnection,
    PlaylistFilter,
    Song,
    Review,
    Vote,
    PaginatedResponse
)
from ..types.song import SongConnection
from ..resolvers.artist import get_artist, get_artists
from ..resolvers.playlist import get_playlist, get_playlists, get_current_challenge
from ..resolvers.song import song, get_songs
from ..resolvers.review import get_review, get_reviews
from ..resolvers.vote import get_vote, get_votes
from strawberry.types import Info

@strawberry.type
class Query:
    def __init__(self):
        print("Query class initialized")  # Debug print

    @strawberry.field
    async def artist(self, id: strawberry.ID, info: Info) -> Optional[Artist]:
        """Get a single artist by ID."""
        return await get_artist(id, info)

    @strawberry.field
    async def artists(
        self,
        first: int = 10,
        after: Optional[str] = None,
        filter: Optional[ArtistFilter] = None,
        info: Info = None
    ) -> ArtistConnection:
        """Get a paginated list of artists."""
        return await get_artists(first, after, filter, info)

    @strawberry.field
    async def current_challenge(self, info: Info) -> Optional[Playlist]:
        """Get the currently active playlist/challenge."""
        return await get_current_challenge(info)

    @strawberry.field
    async def playlist(self, id: strawberry.ID, info: Info) -> Optional[Playlist]:
        """Get a single playlist by ID."""
        return await get_playlist(id, info)

    @strawberry.field
    async def playlists(
        self,
        first: int = 10,
        after: Optional[str] = None,
        filter: Optional[PlaylistFilter] = None,
        info: Info = None
    ) -> PlaylistConnection:
        """Get a paginated list of playlists."""
        return await get_playlists(first, after, filter, info)

    # Legacy queries using old pagination
    song: Optional[Song] = song
    songs: SongConnection = get_songs
    review: Optional[Review] = strawberry.field(resolver=get_review)
    reviews: PaginatedResponse[Review] = strawberry.field(resolver=get_reviews)
    vote: Optional[Vote] = strawberry.field(resolver=get_vote)
    votes: PaginatedResponse[Vote] = strawberry.field(resolver=get_votes) 