from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from core.config import settings

# Create async engine
engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    echo=settings.DB_ECHO,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
)

# Create session maker
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

# Create base class for declarative models
Base = declarative_base()

# For dependency injection
async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

# Backwards compatibility
get_db = get_session
AsyncSessionLocal = async_session_maker

__all__ = [
    "Base",
    "engine",
    "get_db",
    "get_session",
    "AsyncSessionLocal",
    "async_session_maker"
] 