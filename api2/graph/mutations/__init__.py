import strawberry
from .artist import ArtistMutations
from .song import SongMutations
from .playlist import PlaylistMutations
from .review import ReviewMutations
from .vote import VoteMutations

@strawberry.type
class Mutation(
    ArtistMutations,
    SongMutations,
    PlaylistMutations,
    ReviewMutations,
    VoteMutations
):
    pass

__all__ = ["Mutation"]