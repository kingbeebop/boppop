from typing import List, TYPE_CHECKING
from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import TimeStampedBase

if TYPE_CHECKING:
    from .artist import Artist

class User(SQLAlchemyBaseUserTable[int], TimeStampedBase):
    __tablename__ = "users"

    # Columns
    email: Mapped[str] = mapped_column(String(length=320), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(length=50), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(length=1024))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    artists: Mapped[List["Artist"]] = relationship(back_populates="user")