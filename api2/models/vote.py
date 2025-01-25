from typing import TYPE_CHECKING
from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.schema import UniqueConstraint
from .base import TimeStampedBase

if TYPE_CHECKING:
    from .song import Song
    from .artist import Artist
    from .playlist import Playlist

class Vote(TimeStampedBase):
    __tablename__ = "votes"

    # Columns
    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"))
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"))
    playlist_id: Mapped[int] = mapped_column(ForeignKey("playlists.id"))
    comments: Mapped[str | None] = mapped_column(Text)
    
    # Relationships
    song: Mapped["Song"] = relationship(back_populates="votes")
    artist: Mapped["Artist"] = relationship(back_populates="votes")
    playlist: Mapped["Playlist"] = relationship(back_populates="votes")

    __table_args__ = (
        UniqueConstraint('artist_id', 'playlist_id', name='unique_artist_playlist_vote'),
    )