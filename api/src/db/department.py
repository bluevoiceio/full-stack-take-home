import uuid

from sqlmodel import select

from src.db import get_session
from src.exceptions import EntityNotFound
from src.models import Department, Unit


class DepartmentDB:
    def get_department(self, department_id: uuid.UUID) -> Department:
        with get_session() as session:
            department = session.get(Department, department_id)
            if department is None:
                raise EntityNotFound("Department not found")
            return department

    def list_units(self, department_id: uuid.UUID) -> list[Unit]:
        with get_session() as session:
            query = select(Unit).where(Unit.department_id == department_id).order_by(Unit.name)
            return list(session.exec(query).all())
