from .artist import Artist
from .song import Song
from .playlist import Playlist
from .review import Review
from .vote import Vote
from .base import Base, TimeStampedBase

# For convenience when creating all tables
all_models = [Artist, Song, Playlist, Review, Vote] 