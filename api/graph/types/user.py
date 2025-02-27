from typing import Optional
from datetime import datetime
from strawberry.types import ID
from strawberry import StrawberryType
from .artist import Artist

@StrawberryType
class User:
    id: ID
    username: str
    email: str
    created_at: datetime
    updated_at: datetime
    artist: Optional["Artist"] = None