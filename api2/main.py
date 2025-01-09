from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, artists, songs, playlists, challenges
from .core.config import settings
from strawberry.fastapi import GraphQLRouter
from .graphql.schema import schema

app = FastAPI(title="Bop Pop API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(artists.router, prefix="/api/artists", tags=["artists"])
app.include_router(songs.router, prefix="/api/songs", tags=["songs"])
app.include_router(playlists.router, prefix="/api/playlists", tags=["playlists"])
app.include_router(challenges.router, prefix="/api/challenges", tags=["challenges"])

# GraphQL endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 