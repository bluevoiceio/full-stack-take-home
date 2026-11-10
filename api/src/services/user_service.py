import uuid

from src import seed
from src.exceptions import EntityNotFound
from src.models import User


class UserService:
    """Reads the identity provider's directory. In production this is a network call to a
    separate system, so the roster can change underneath any `user_id` the database holds."""

    def get_users(self, department_id: uuid.UUID) -> list[User]:
        users = [user for user in seed.USERS if user.department_id == department_id]
        return sorted(users, key=lambda user: (user.last_name, user.first_name))

    def get_user(self, user_id: uuid.UUID) -> User:
        for user in seed.USERS:
            if user.id == user_id:
                return user
        raise EntityNotFound("User not found")

    def get_user_by_email(self, email: str) -> User:
        for user in seed.USERS:
            if user.email == email.strip().lower():
                return user
        raise EntityNotFound("User not found")
