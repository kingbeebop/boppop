from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession, AsyncEngine
from core.config import settings
from typing import AsyncGenerator

# Create async engine
engine: AsyncEngine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    echo=settings.DB_ECHO,
    future=True,
    pool_pre_ping=True
)

# Create session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Backwards compatibility for existing code
AsyncSessionLocal = async_session_maker

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get a database session."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

# Aliases for FastAPI dependency injection
get_async_session = get_session
get_db = get_session

__all__ = [
    "engine",
    "async_session_maker",
    "AsyncSessionLocal",  # Added back for compatibility
    "get_session",
    "get_async_session",
    "get_db"
] 