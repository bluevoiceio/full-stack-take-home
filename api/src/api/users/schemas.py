import uuid
from typing import Optional, Self

from pydantic import BaseModel

from src.models import TitleRank, User, UserRole


class UserResponseModel(BaseModel):
    id: uuid.UUID
    email: str
    firstName: str
    lastName: str
    title: TitleRank
    employeeId: str
    departmentId: uuid.UUID
    role: UserRole
    superiorEmail: Optional[str]

    @classmethod
    def from_user(cls, user: User) -> Self:
        return cls(
            id=user.id,
            email=user.email,
            firstName=user.first_name,
            lastName=user.last_name,
            title=user.title,
            employeeId=user.employee_id,
            departmentId=user.department_id,
            role=user.role,
            superiorEmail=user.superior_email,
        )
