import uuid

from src.db.group import GroupDB
from src.exceptions import EntityAlreadyExists, UnprocessableEntity
from src.models import Group, User
from src.services.user_service import UserService


class GroupService:
    def __init__(self):
        self._group_db = GroupDB()

    def get_group(self, group_id: uuid.UUID) -> Group:
        return self._group_db.get_group(group_id)

    def get_members(self, group: Group) -> list[User]:
        return self._members_by_group([group])[group.id]

    def list_groups_with_members(
        self, department_id: uuid.UUID, skip: int = 0, limit: int | None = None
    ) -> list[tuple[Group, list[User]]]:
        groups = self._group_db.list_groups(department_id, skip=skip, limit=limit)
        members = self._members_by_group(groups)
        return [(group, members[group.id]) for group in groups]

    def get_member_ids(self, group_ids: list[uuid.UUID]) -> list[uuid.UUID]:
        """Every user in any of the groups, once each."""
        by_group = self._group_db.list_member_ids(group_ids)
        return list(dict.fromkeys(user_id for user_ids in by_group.values() for user_id in user_ids))

    def create_group(self, name: str, department_id: uuid.UUID, created_by: uuid.UUID) -> Group:
        name = self._clean_name(name)
        if self._group_db.get_group_by_name(department_id, name) is not None:
            raise EntityAlreadyExists(f"A group named {name!r} already exists")
        return self._group_db.create_group(Group(name=name, department_id=department_id, created_by=created_by))

    def rename_group(self, group: Group, name: str) -> Group:
        name = self._clean_name(name)
        existing = self._group_db.get_group_by_name(group.department_id, name)
        if existing is not None and existing.id != group.id:
            raise EntityAlreadyExists(f"A group named {name!r} already exists")
        return self._group_db.rename_group(group.id, name)

    def delete_group(self, group_id: uuid.UUID) -> None:
        self._group_db.delete_group(group_id)

    def assign_users(self, group: Group, user_ids: list[uuid.UUID]) -> None:
        roster = {user.id for user in UserService().get_users(group.department_id)}
        unknown = [user_id for user_id in user_ids if user_id not in roster]
        if unknown:
            raise UnprocessableEntity(f"Users are not in this department: {', '.join(map(str, unknown))}")
        self._group_db.add_members(group.id, user_ids)

    def unassign_users(self, group: Group, user_ids: list[uuid.UUID]) -> None:
        self._group_db.remove_members(group.id, user_ids)

    def _members_by_group(self, groups: list[Group]) -> dict[uuid.UUID, list[User]]:
        """Membership rows can outlive the user they point at, so they are read through the
        live roster and stale rows are dropped."""
        if not groups:
            return {}
        roster = {user.id: user for user in UserService().get_users(groups[0].department_id)}
        member_ids = self._group_db.list_member_ids([group.id for group in groups])
        return {
            group_id: [user for user in roster.values() if user.id in set(user_ids)]
            for group_id, user_ids in member_ids.items()
        }

    @staticmethod
    def _clean_name(name: str) -> str:
        name = name.strip()
        if not name:
            raise UnprocessableEntity("Group name must not be empty.")
        return name
