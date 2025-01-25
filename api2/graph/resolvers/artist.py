from typing import Optional
from sqlalchemy import select
from db.session import get_db
from models.artist import Artist as ArtistModel
from ..types import Artist, PaginatedResponse, PageInfo

async def get_artist(id: str) -> Optional[Artist]:
    db = next(get_db())
    result = db.execute(
        select(ArtistModel).where(ArtistModel.id == id)
    ).scalar_one_or_none()
    return result

async def get_artists(
    page: int = 1,
    per_page: int = 10,
    search: Optional[str] = None
) -> PaginatedResponse[Artist]:
    db = next(get_db())
    query = select(ArtistModel)
    
    if search:
        query = query.filter(ArtistModel.username.ilike(f"%{search}%"))
    
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