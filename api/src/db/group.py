import uuid

from sqlalchemy import delete, func
from sqlalchemy.exc import IntegrityError
from sqlmodel import col, select

from src.db import get_session
from src.exceptions import EntityAlreadyExists, EntityNotFound
from src.models import Group, GroupUser, utcnow


class GroupDB:
    def list_groups(self, department_id: uuid.UUID, skip: int = 0, limit: int | None = None) -> list[Group]:
        with get_session() as session:
            query = select(Group).where(Group.department_id == department_id).order_by(Group.name).offset(skip)
            if limit is not None:
                query = query.limit(limit)
            return list(session.exec(query).all())

    def get_group(self, group_id: uuid.UUID) -> Group:
        with get_session() as session:
            group = session.get(Group, group_id)
            if group is None:
                raise EntityNotFound(f"Group {group_id=} not found")
            return group

    def get_group_by_name(self, department_id: uuid.UUID, name: str) -> Group | None:
        with get_session() as session:
            query = select(Group).where(Group.department_id == department_id, func.lower(Group.name) == name.lower())
            return session.exec(query).first()

    def create_group(self, group: Group) -> Group:
        with get_session() as session:
            session.add(group)
            try:
                session.commit()
            except IntegrityError as e:
                session.rollback()
                raise EntityAlreadyExists(f"A group named {group.name!r} already exists") from e
            return group

    def rename_group(self, group_id: uuid.UUID, name: str) -> Group:
        with get_session() as session:
            group = session.get(Group, group_id)
            if group is None:
                raise EntityNotFound(f"Group {group_id=} not found")
            group.name = name
            group.updated_at = utcnow()
            try:
                session.commit()
            except IntegrityError as e:
                session.rollback()
                raise EntityAlreadyExists(f"A group named {name!r} already exists") from e
            return group

    def delete_group(self, group_id: uuid.UUID) -> None:
        with get_session() as session:
            group = session.get(Group, group_id)
            if group is None:
                raise EntityNotFound(f"Group {group_id=} not found")
            session.delete(group)
            session.commit()

    def list_member_ids(self, group_ids: list[uuid.UUID]) -> dict[uuid.UUID, list[uuid.UUID]]:
        members: dict[uuid.UUID, list[uuid.UUID]] = {group_id: [] for group_id in group_ids}
        if not group_ids:
            return members
        with get_session() as session:
            query = select(GroupUser).where(col(GroupUser.group_id).in_(group_ids))
            for row in session.exec(query).all():
                members[row.group_id].append(row.user_id)
        return members

    def add_members(self, group_id: uuid.UUID, user_ids: list[uuid.UUID]) -> None:
        with get_session() as session:
            query = select(GroupUser.user_id).where(GroupUser.group_id == group_id)
            existing = set(session.exec(query).all())
            session.add_all(
                GroupUser(group_id=group_id, user_id=user_id)
                for user_id in dict.fromkeys(user_ids)
                if user_id not in existing
            )
            session.commit()

    def remove_members(self, group_id: uuid.UUID, user_ids: list[uuid.UUID]) -> None:
        with get_session() as session:
            session.execute(
                delete(GroupUser).where(col(GroupUser.group_id) == group_id, col(GroupUser.user_id).in_(user_ids))
            )
            session.commit()
