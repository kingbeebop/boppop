from typing import List, Optional
import strawberry
from strawberry.types import Info
from .types import Song, SongConnection, SongFilter
from .resolvers import get_song, get_songs, get_songs_by_ids

@strawberry.type
class Query:
    # ... other queries ...
    
    @strawberry.field
    async def song(self, info: Info, id: str) -> Optional[Song]:
        return await get_song(id, info)

    @strawberry.field
    async def songs(
        self,
        info: Info,
        first: int = 10,
        after: Optional[str] = None,
        filter: Optional[SongFilter] = None
    ) -> SongConnection:
        return await get_songs(first, after, filter, info)

    @strawberry.field
    async def songs_by_ids(self, info: Info, ids: List[str]) -> List[Song]:
        return await get_songs_by_ids(ids, info) 