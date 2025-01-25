from typing import Generic, TypeVar, List, Optional
import strawberry

T = TypeVar("T")

@strawberry.type
class PageInfo:
    has_next_page: bool
    has_previous_page: bool
    start_cursor: Optional[str] = None
    end_cursor: Optional[str] = None
    total_pages: int
    total_items: int
    current_page: int
    items_per_page: int

@strawberry.type
class PaginatedResponse(Generic[T]):
    items: List[T]
    page_info: PageInfo 