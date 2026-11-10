import uuid
from typing import Self

from pydantic import BaseModel

from src.models import Unit


class UnitResponseModel(BaseModel):
    id: uuid.UUID
    departmentId: uuid.UUID
    name: str
    default: bool

    @classmethod
    def from_unit(cls, unit: Unit) -> Self:
        return cls(id=unit.id, departmentId=unit.department_id, name=unit.name, default=unit.default)
