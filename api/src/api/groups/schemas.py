import uuid
from datetime import datetime
from typing import Self, Sequence

from pydantic import BaseModel

from src.api.users.schemas import UserResponseModel
from src.models import Group, User


class GroupCreateModel(BaseModel):
    name: str


class GroupUpdateModel(BaseModel):
    name: str


class AssignGroupUsersModel(BaseModel):
    userIds: list[uuid.UUID]


class GroupResponseModel(BaseModel):
    id: uuid.UUID
    name: str
    departmentId: uuid.UUID
    createdBy: uuid.UUID
    createdAt: datetime
    updatedAt: datetime
    members: list[UserResponseModel]

    @classmethod
    def from_group(cls, group: Group, members: Sequence[User] = ()) -> Self:
        return cls(
            id=group.id,
            name=group.name,
            departmentId=group.department_id,
            createdBy=group.created_by,
            createdAt=group.created_at,
            updatedAt=group.updated_at,
            members=[UserResponseModel.from_user(member) for member in members],
        )
