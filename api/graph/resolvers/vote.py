from typing import Optional
from sqlalchemy import select
from db.session import get_db
from models.vote import Vote as VoteModel
from ..types import Vote, PaginatedResponse, PageInfo

async def get_vote(id: str) -> Optional[Vote]:
    db = next(get_db())
    result = db.execute(
        select(VoteModel).where(VoteModel.id == id)
    ).scalar_one_or_none()
    return result

async def get_votes(
    page: int = 1,
    per_page: int = 10,
    playlist_id: Optional[str] = None
) -> PaginatedResponse[Vote]:
    db = next(get_db())
    query = select(VoteModel)
    
    if playlist_id:
        query = query.filter(VoteModel.playlist_id == playlist_id)
    
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