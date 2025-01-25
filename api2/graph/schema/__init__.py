import strawberry
from .queries import Query
from .mutations import Mutation
# from .subscriptions import Subscription

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    # subscription=Subscription
)

__all__ = ["schema"]