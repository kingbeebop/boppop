from typing import Optional
from sqlalchemy import select
from db.session import get_db
from models.playlist import Playlist as PlaylistModel
from ..types import Playlist, PaginatedResponse, PageInfo

async def get_playlist(id: str) -> Optional[Playlist]:
    db = next(get_db())
    result = db.execute(
        select(PlaylistModel).where(PlaylistModel.id == id)
    ).scalar_one_or_none()
    return result

async def get_playlists(
    page: int = 1,
    per_page: int = 10,
    active: Optional[bool] = None
) -> PaginatedResponse[Playlist]:
    db = next(get_db())
    query = select(PlaylistModel)
    
    if active is not None:
        query = query.filter(PlaylistModel.active == active)
    
    total = db.execute(query.with_only_columns([db.func.count()])).scalar()
    
    query = query.offset((page - 1) * per_page).limit(per_page)
    results = db.execute(query).scalars().all()
    
    return PaginatedResponse(
        items=results,
        page_info=PageInfo(
            has_next_page=total > page * per_page,
            has_previous_page=page > 1,
            total_pages=(total + per_page - 1) // per_page,
            total_items=total,
            current_page=page,
            items_per_page=per_page
        )
    )