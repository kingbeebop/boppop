from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.users import auth_backend, fastapi_users
from schemas.auth import UserRead, UserCreate, UserUpdate

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
    return {"status": "healthy"}

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