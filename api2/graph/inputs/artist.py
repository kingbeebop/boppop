from typing import Optional
import strawberry

@strawberry.input
class ArtistInput:
    username: str
    email: str
    password: str
    bio: Optional[str] = None
    profile_pic: Optional[str] = None

@strawberry.input
class ArtistUpdateInput:
    username: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    profile_pic: Optional[str] = None 