from typing import List

from fastapi import APIRouter

from src.api.auth.schemas import LoginModel, LoginResponseModel
from src.api.common.auth import issue_access_token
from src.api.users.schemas import UserResponseModel
from src.seed import DEPARTMENT_ID
from src.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/accounts", response_model=List[UserResponseModel])
def list_accounts():
    """Every account you can sign in as. Exists only so the apps can offer a picker."""
    return [UserResponseModel.from_user(user) for user in UserService().get_users(DEPARTMENT_ID)]


@router.post("/login", response_model=LoginResponseModel)
def login(login_model: LoginModel):
    user = UserService().get_user_by_email(login_model.email)
    return LoginResponseModel(accessToken=issue_access_token(user), user=UserResponseModel.from_user(user))
