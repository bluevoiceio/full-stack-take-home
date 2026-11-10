from typing import Annotated, List

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from src.api.common.auth import credentials_scheme, user_from_auth_creds
from src.api.users.schemas import UserResponseModel
from src.services.user_service import UserService

router = APIRouter(tags=["users"])


@router.get("", response_model=List[UserResponseModel])
def list_users(credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)]):
    """The caller's department roster."""
    user = user_from_auth_creds(credentials)
    return [UserResponseModel.from_user(u) for u in UserService().get_users(user.department_id)]


@router.get("/me", response_model=UserResponseModel)
def get_me(credentials: Annotated[HTTPAuthorizationCredentials, Depends(credentials_scheme)]):
    user = user_from_auth_creds(credentials)
    return UserResponseModel.from_user(UserService().get_user(user.sub))
