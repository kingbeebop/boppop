from redis.asyncio import Redis, ConnectionPool
from typing import AsyncGenerator
from .config import settings

class RedisManager:
    _pool: ConnectionPool | None = None
    _redis: Redis | None = None

    @classmethod
    async def get_redis(cls) -> AsyncGenerator[Redis, None]:
        if cls._redis is None:
            if cls._pool is None:
                cls._pool = ConnectionPool.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True
                )
            cls._redis = Redis(connection_pool=cls._pool)
        try:
            yield cls._redis
        finally:
            pass

    @classmethod
    async def close(cls):
        if cls._redis:
            await cls._redis.close()
            cls._redis = None
        if cls._pool:
            await cls._pool.disconnect()
            cls._pool = None

# Dependency for FastAPI
async def get_redis_client() -> AsyncGenerator[Redis, None]:
    redis = await RedisManager.get_redis().__anext__()
    try:
        yield redis
    finally:
        pass