import strawberry
from fastapi import Request
from graph.schema import schema
from strawberry.fastapi import GraphQLRouter
from graph.context import get_context

# Create the GraphQL app using Strawberry's FastAPI integration
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_context,
    graphiql=True  # Added back for development
)