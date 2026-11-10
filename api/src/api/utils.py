import uuid

from src.models import AuthUser


def user_can_access_department_id(user: AuthUser, department_id: uuid.UUID | None) -> bool:
    return department_id == user.department_id
