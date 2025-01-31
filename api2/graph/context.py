from typing import Optional, Any
from dataclasses import dataclass
from fastapi import Request, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from models.artist import Artist
from db.session import get_session
from core.auth import optional_user_with_artist, auth_backend
from strawberry.fastapi import BaseContext

@dataclass
class GraphQLContext(BaseContext):
    """GraphQL context with auth and database access."""
    request: Request
    session: AsyncSession
    response: Response
    user: Optional[User] = None
    artist: Optional[Artist] = None

    @property
    def is_authenticated(self) -> bool:
        """Check if user is authenticated."""
        return self.user is not None and self.user.is_active

    def get(self, key: str, default: Any = None) -> Any:
        """Compatibility method for older code that uses dict-style access."""
        return getattr(self, key, default)

    async def load_user(self) -> None:
        """Load user from auth token."""
        auth_header = self.request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return

        token = auth_header.replace("Bearer ", "")
        user_id = verify_token(token)
        if user_id:
            self.user = await self.session.get(User, user_id)
            if self.user:
                self.artist = self.user.artist

    async def close(self) -> None:
        """Close the database session."""
        if self.session:
            await self.session.close()

    async def refresh_token_if_needed(self) -> Optional[str]:
        """Try to refresh the access token if it's expired."""
        auth_header = self.request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.replace("Bearer ", "")
        try:
            strategy = auth_backend.get_strategy()
            user_id = await strategy.read_token(token)
            if user_id:
                return None  # Token is still valid
        except Exception:
            refresh_token = self.request.cookies.get("refresh_token")
            if refresh_token:
                try:
                    new_token = await refresh_token(refresh_token)
                    return new_token["access_token"]
                except Exception:
                    return None
        return None

    async def handle_token_refresh(self) -> None:
        """Handle token refresh if needed."""
        new_token = await self.refresh_token_if_needed()
        if new_token:
            self.response.headers["X-New-Token"] = new_token

async def get_graphql_context(
    request: Request,
    session: AsyncSession = Depends(get_session),
    user: Optional[User] = Depends(optional_user_with_artist)
) -> GraphQLContext:
    """Create GraphQL context using FastAPI's dependency injection."""
    return GraphQLContext(
        request=request,
        session=session,
        response=Response(),
        user=user,
        artist=user.artist if user else None
    )