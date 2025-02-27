from pydantic import BaseModel, validator, EmailStr, HttpUrl
import re
from typing import Optional

class ArtistValidator(BaseModel):
    """Validation rules for Artist input."""
    username: str
    email: EmailStr
    password: str
    bio: Optional[str] = None
    profile_pic: Optional[HttpUrl] = None

    @validator('username')
    def username_valid(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', v):
            raise ValueError('Username must be 3-20 characters, alphanumeric and underscore only')
        return v

    @validator('password')
    def password_valid(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

class SongValidator(BaseModel):
    """Validation rules for Song input."""
    title: str
    url: HttpUrl
    artist_id: int
    playlist_id: int

    @validator('title')
    def title_valid(cls, v):
        if not 1 <= len(v) <= 100:
            raise ValueError('Title must be between 1 and 100 characters')
        return v

    @validator('url')
    def url_valid(cls, v):
        if not str(v).startswith('https://soundcloud.com/'):
            raise ValueError('URL must be a SoundCloud URL')
        return v