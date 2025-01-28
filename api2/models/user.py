from typing import TYPE_CHECKING, Optional
from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import TimeStampedBase

if TYPE_CHECKING:
    from .artist import Artist

class User(SQLAlchemyBaseUserTable[int], TimeStampedBase):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(length=50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(length=320), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(length=1024))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Single artist relationship
    artist: Mapped["Artist"] = relationship(back_populates="user", uselist=False)

    @property
    def artist_id(self) -> Optional[int]:
        return self.artist.id if self.artist else None