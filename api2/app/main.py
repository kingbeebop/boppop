from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth
from app.core.config import settings
from app.core.redis import RedisManager
from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema

app = FastAPI(title="Bop Pop API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth router
app.include_router(auth.router, prefix="/api", tags=["auth"])

# GraphQL endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

@app.on_event("startup")
async def startup_event():
    # Initialize Redis connection pool
    await RedisManager.get_redis()

@app.on_event("shutdown")
async def shutdown_event():
    # Close Redis connections
    await RedisManager.close()

@app.get("/health")
async def health_check():
    redis = await RedisManager.get_redis()
    try:
        await redis.ping()
        redis_status = "healthy"
    except Exception:
        redis_status = "unhealthy"
    
    return {
        "status": "healthy",
        "redis": redis_status
    } 