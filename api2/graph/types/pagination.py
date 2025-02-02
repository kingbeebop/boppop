import strawberry
from typing import Optional, TypeVar, Generic, List

@strawberry.type
class PageInfo:
    """Information about pagination in a connection."""
    hasNextPage: bool
    hasPreviousPage: bool
    startCursor: Optional[str]
    endCursor: Optional[str]

T = TypeVar('T')

@strawberry.type
class Edge(Generic[T]):
    """An edge in a connection."""
    node: T
    cursor: str

@strawberry.type
class Connection(Generic[T]):
    """A connection of items."""
    edges: List[Edge[T]]
    pageInfo: PageInfo
    totalCount: int

# Legacy support for old pagination style
@strawberry.type
class PaginatedResponse(Generic[T]):
    items: List[T]
    page_info: PageInfo 