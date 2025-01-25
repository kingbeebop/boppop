import strawberry
from typing import Optional, List
from ..types import Artist, Song, Playlist, Review, Vote, PaginatedResponse
from ..resolvers.artist import get_artist, get_artists
from ..resolvers.song import get_song, get_songs
from ..resolvers.playlist import get_playlist, get_playlists
from ..resolvers.review import get_review, get_reviews
from ..resolvers.vote import get_vote, get_votes

@strawberry.type
class Query:
    # Artist queries
    artist: Optional[Artist] = strawberry.field(resolver=get_artist)
    artists: PaginatedResponse[Artist] = strawberry.field(resolver=get_artists)

    # Song queries
    song: Optional[Song] = strawberry.field(resolver=get_song)
    songs: PaginatedResponse[Song] = strawberry.field(resolver=get_songs)

    # Playlist queries
    playlist: Optional[Playlist] = strawberry.field(resolver=get_playlist)
    playlists: PaginatedResponse[Playlist] = strawberry.field(resolver=get_playlists)

    # Review queries
    review: Optional[Review] = strawberry.field(resolver=get_review)
    reviews: PaginatedResponse[Review] = strawberry.field(resolver=get_reviews)

    # Vote queries
    vote: Optional[Vote] = strawberry.field(resolver=get_vote)
    votes: PaginatedResponse[Vote] = strawberry.field(resolver=get_votes) 