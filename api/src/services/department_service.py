import uuid

from src.db.department import DepartmentDB
from src.models import Department, Unit


class DepartmentService:
    def __init__(self):
        self._department_db = DepartmentDB()

    def get_department(self, department_id: uuid.UUID) -> Department:
        return self._department_db.get_department(department_id)

    def list_units(self, department_id: uuid.UUID) -> list[Unit]:
        return self._department_db.list_units(department_id)
