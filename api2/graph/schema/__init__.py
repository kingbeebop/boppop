import strawberry
from .queries import Query

schema = strawberry.Schema(query=Query)

__all__ = ["schema"]