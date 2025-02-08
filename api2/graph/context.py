import logging
from typing import Optional
from fastapi import Request
from strawberry.fastapi import BaseContext
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import AsyncSessionLocal, get_session
from core.users import auth_backend, UserManager, get_user_db
from models.user import User

logger = logging.getLogger(__name__)

class GraphQLContext(BaseContext):
    def __init__(self, request: Request):
        super().__init__()
        self.request = request
        self._user = None
        self._session = None
        self.auth_header = request.headers.get('Authorization')
        logger.info(f"Auth header in context: {self.auth_header}")

    @property
    async def user(self):
        if self._user is None and self.auth_header:
            if self.auth_header.startswith('Bearer '):
                token = self.auth_header.replace('Bearer ', '')
                strategy = auth_backend.get_strategy()
                
                # Create user manager properly
                session = await self.get_session()
                user_db = await anext(get_user_db(session))
                user_manager = UserManager(user_db)
                
                try:
                    user = await strategy.read_token(token, user_manager)
                    logger.info(f"User from token: {user}")
                    self._user = user
                except Exception as e:
                    logger.error(f"Error reading token: {e}")
                    self._user = None
        return self._user

    async def get_session(self) -> AsyncSession:
        if self._session is None:
            self._session = AsyncSessionLocal()
        return self._session

def get_context(request: Request) -> GraphQLContext:
    return GraphQLContext(request)

__all__ = ["GraphQLContext", "get_context"]