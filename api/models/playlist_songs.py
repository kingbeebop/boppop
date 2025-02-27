from sqlalchemy import Table, Column, ForeignKey
from .base import Base

playlist_songs = Table(
    "playlist_songs",
    Base.metadata,
    Column("playlist_id", ForeignKey("playlists.id", ondelete="CASCADE"), primary_key=True),
    Column("song_id", ForeignKey("songs.id", ondelete="CASCADE"), primary_key=True)
)
