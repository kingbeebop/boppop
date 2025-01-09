from redis.asyncio import Redis, ConnectionPool
from typing import Optional
from .config import settings

class RedisManager:
    _pool: Optional[ConnectionPool] = None
    _redis: Optional[Redis] = None

    @classmethod
    async def get_redis(cls) -> Redis:
        if cls._redis is None:
            if cls._pool is None:
                cls._pool = ConnectionPool.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True,
                    max_connections=10
                )
            cls._redis = Redis(connection_pool=cls._pool)
        return cls._redis

    @classmethod
    async def close(cls):
        if cls._redis is not None:
            await cls._redis.close()
            cls._redis = None
        if cls._pool is not None:
            await cls._pool.disconnect()
            cls._pool = None

# Dependency for FastAPI
async def get_redis_client() -> Redis:
    redis = await RedisManager.get_redis()
    try:
        yield redis
    finally:
        # Connection is returned to pool, not closed
        pass