from typing import List, TYPE_CHECKING
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import TimeStampedBase

if TYPE_CHECKING:
    from .user import User
    from .song import Song
    from .review import Review
    from .vote import Vote

class Artist(TimeStampedBase):
    __tablename__ = "artists"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(length=100))
    bio: Mapped[str | None] = mapped_column(String)
    profile_pic: Mapped[str | None] = mapped_column(String)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="artist")
    songs: Mapped[List["Song"]] = relationship(back_populates="artist")
    written_reviews: Mapped[List["Review"]] = relationship(back_populates="author")
    votes: Mapped[List["Vote"]] = relationship(back_populates="artist")