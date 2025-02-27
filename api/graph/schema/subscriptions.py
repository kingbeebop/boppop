from typing import AsyncGenerator
import strawberry
from strawberry.types import Info
from ..types import Vote
from core.redis import RedisManager

@strawberry.type
class Subscription:
    @strawberry.subscription
    async def vote_updates(self, info: Info) -> AsyncGenerator[Vote, None]:
        async for redis in RedisManager.get_redis():
            pubsub = redis.pubsub()
            await pubsub.subscribe("votes")
            try:
                async for message in pubsub.listen():
                    if message["type"] == "message":
                        vote_data = message["data"]
                        yield Vote(**vote_data)
            finally:
                await pubsub.unsubscribe("votes") 