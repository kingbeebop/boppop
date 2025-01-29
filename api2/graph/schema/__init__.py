import strawberry
from .queries import Query
from .mutations import Mutation
from .subscriptions import Subscription

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription,
    types=[],  # Add any additional types that need to be explicitly included
)

__all__ = ["schema"]