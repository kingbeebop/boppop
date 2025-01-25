import strawberry
from ..mutations.artist import ArtistMutations
from ..mutations.song import SongMutations
from ..mutations.playlist import PlaylistMutations
from ..mutations.review import ReviewMutations
from ..mutations.vote import VoteMutations

@strawberry.type
class Mutation(
    ArtistMutations,
    SongMutations,
    PlaylistMutations,
    ReviewMutations,
    VoteMutations
):
    """Root mutation type that combines all mutation classes"""
    pass 