from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.users import auth_backend, fastapi_users
from schemas.auth import UserRead, UserCreate, UserUpdate
from core.health import check_db_health
from core.events import *  # This will register our event listeners
from strawberry.fastapi import GraphQLRouter
from schemas.graphql import schema
from graph.context import get_graphql_context

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    db_healthy = await check_db_health()
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "database": "connected" if db_healthy else "disconnected"
    }

# Auth routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/auth/jwt",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/api/auth",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/api/auth",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/api/auth",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/api/users",
    tags=["users"]
)

# Create GraphQL endpoint with context
graphql_app = GraphQLRouter(
    schema,
    context_getter=get_graphql_context,
    graphiql=True
)

@app.middleware("http")
async def cleanup_context(request: Request, call_next):
    """Cleanup any resources after the request is complete."""
    response = await call_next(request)
    if hasattr(request.state, "context"):
        await request.state.context.close()
    return response

app.include_router(graphql_app, prefix="/api/graphql")