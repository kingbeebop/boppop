from typing import Optional
from fastapi import Request
from strawberry.fastapi import BaseContext
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import async_session_maker

class GraphQLContext(BaseContext):
    def __init__(self, request: Request):
        super().__init__()
        self.request = request
        self._session: Optional[AsyncSession] = None

    async def get_session(self) -> AsyncSession:
        """Get the database session for this context."""
        if self._session is None:
            self._session = async_session_maker()
        return self._session

    async def close(self):
        """Clean up resources."""
        if self._session is not None:
            await self._session.close()
            self._session = None

def get_context(request: Request) -> GraphQLContext:
    """Create a new GraphQL context for each request."""
    return GraphQLContext(request)

__all__ = ["GraphQLContext", "get_context"]