import uuid
from datetime import datetime, timezone
from enum import StrEnum
from typing import Optional

from pydantic import BaseModel, NaiveDatetime
from sqlalchemy import Column, ForeignKey, Index, text
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    """Stored timestamps are UTC with no tzinfo, and go over the wire without an offset."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class UserRole(StrEnum):
    ADMIN = "admin"
    OFFICER = "officer"


class TitleRank(StrEnum):
    """Values are display strings, so clients render them as-is."""

    OFFICER = "Officer"
    DETECTIVE = "Detective"
    CORPORAL = "Corporal"
    SERGEANT = "Sergeant"
    LIEUTENANT = "Lieutenant"
    CAPTAIN = "Captain"
    CHIEF_OF_POLICE = "Chief of Police"
    DISPATCHER = "Dispatcher"


class User(BaseModel):
    """A person in the identity provider's directory. There is no user table: other tables hold
    a bare `user_id` with no foreign key, and reads check it against the live roster."""

    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    title: TitleRank
    employee_id: str
    department_id: uuid.UUID
    role: UserRole
    # Email of the user's superior in the chain of command, in the same department.
    superior_email: Optional[str] = None


class AuthUser(BaseModel):
    """The caller, as read from the access token."""

    sub: uuid.UUID
    email: str
    role: UserRole
    department_id: uuid.UUID


class Department(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    city: str
    state: str
    # IANA name, e.g. "America/Chicago".
    timezone: str
    created_at: NaiveDatetime = Field(default_factory=utcnow)


class Unit(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    department_id: uuid.UUID = Field(
        sa_column=Column(ForeignKey("department.id", ondelete="CASCADE"), nullable=False, index=True)
    )
    name: str
    default: bool = Field(default=False)


class Group(SQLModel, table=True):
    """A named set of users within a department, used for bulk assignment. Consumers expand
    membership at use-time and store the expanded user IDs, so groups can be hard-deleted safely."""

    # 'group' is a reserved SQL keyword.
    __tablename__ = "user_group"
    __table_args__ = (Index("uq_user_group_department_lower_name", "department_id", text("lower(name)"), unique=True),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    department_id: uuid.UUID = Field(
        sa_column=Column(ForeignKey("department.id", ondelete="CASCADE"), nullable=False, index=True)
    )
    name: str
    created_by: uuid.UUID
    created_at: NaiveDatetime = Field(default_factory=utcnow)
    updated_at: NaiveDatetime = Field(default_factory=utcnow)


class GroupUser(SQLModel, table=True):
    __tablename__ = "user_group_member"

    group_id: uuid.UUID = Field(sa_column=Column(ForeignKey("user_group.id", ondelete="CASCADE"), primary_key=True))
    user_id: uuid.UUID = Field(primary_key=True, description="Directory user ID")
    created_at: NaiveDatetime = Field(default_factory=utcnow)


class UserNotification(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    message: str
    sender_id: uuid.UUID = Field(description="Directory user ID")
    receiver_id: uuid.UUID = Field(index=True, description="Directory user ID")
    created_at: NaiveDatetime = Field(default_factory=utcnow)
    read: bool = Field(default=False)
