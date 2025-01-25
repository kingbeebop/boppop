from typing import Optional
from dataclasses import dataclass
from fastapi import Request
from models.artist import Artist

@dataclass
class Context:
    """GraphQL context containing request and authenticated user information."""
    request: Request
    user: Optional[Artist] = None
    
    @property
    def is_authenticated(self) -> bool:
        """Check if there is an authenticated user."""
        return self.user is not None

async def get_context(request: Request) -> Context:
    """Create GraphQL context from FastAPI request.
    
    Args:
        request: The FastAPI request object
        
    Returns:
        Context object with request and authenticated user (if any)
    """
    # TODO: Add user authentication logic here
    # Example:
    # token = request.headers.get("Authorization")
    # user = await authenticate_user(token)
    return Context(request=request)