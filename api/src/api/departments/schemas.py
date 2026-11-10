import uuid
from typing import Self

from pydantic import BaseModel

from src.models import Department


class DepartmentResponseModel(BaseModel):
    id: uuid.UUID
    name: str
    city: str
    state: str
    timezone: str

    @classmethod
    def from_department(cls, department: Department) -> Self:
        return cls(
            id=department.id,
            name=department.name,
            city=department.city,
            state=department.state,
            timezone=department.timezone,
        )
