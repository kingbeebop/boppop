from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from .users import UserManager, get_user_manager

async def authenticate_user(
    credentials: OAuth2PasswordRequestForm = Depends(),
    user_manager: UserManager = Depends(get_user_manager),
) -> User:
    user = await user_manager.get_with_artist(credentials.username)
    if not user or not user.verify_password(credentials.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return user 