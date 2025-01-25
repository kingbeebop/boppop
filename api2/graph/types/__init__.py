from .artist import Artist, ArtistInput, ArtistUpdateInput
from .song import Song, SongInput, SongUpdateInput
from .playlist import Playlist, PlaylistInput, PlaylistUpdateInput
from .review import Review, ReviewInput, ReviewUpdateInput
from .vote import Vote, VoteInput, VoteUpdateInput
from .pagination import PageInfo, PaginatedResponse

__all__ = [
    "Artist", "ArtistInput", "ArtistUpdateInput",
    "Song", "SongInput", "SongUpdateInput",
    "Playlist", "PlaylistInput", "PlaylistUpdateInput",
    "Review", "ReviewInput", "ReviewUpdateInput",
    "Vote", "VoteInput", "VoteUpdateInput",
    "PageInfo", "PaginatedResponse"
]