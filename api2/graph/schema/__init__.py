import strawberry
from .queries import Query
from .mutations import Mutation
from .subscriptions import Subscription

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription,
    types=[]  # We'll let the main schema handle type registration
)

__all__ = ["schema"]