from pydantic import BaseModel

from src.api.users.schemas import UserResponseModel


class LoginModel(BaseModel):
    email: str


class LoginResponseModel(BaseModel):
    accessToken: str
    user: UserResponseModel
