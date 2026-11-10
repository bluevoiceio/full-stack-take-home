"""Starting data. USERS stands in for the identity provider's directory and is never written
to the database; everything else is inserted once, when the database is empty."""

import uuid
from datetime import timedelta

from src.models import Department, Group, GroupUser, TitleRank, Unit, User, UserNotification, UserRole, utcnow


def _id(n: int) -> uuid.UUID:
    return uuid.UUID(int=n)


DEPARTMENT_ID = _id(0x1000)

DEPARTMENT = Department(
    id=DEPARTMENT_ID,
    name="Cedar Ridge Police Department",
    city="Cedar Ridge",
    state="IA",
    timezone="America/Chicago",
)

UNITS = [
    Unit(id=_id(0x2001), department_id=DEPARTMENT_ID, name="Patrol", default=True),
    Unit(id=_id(0x2002), department_id=DEPARTMENT_ID, name="Investigations"),
    Unit(id=_id(0x2003), department_id=DEPARTMENT_ID, name="Dispatch"),
]


def _user(
    n: int, first: str, last: str, title: TitleRank, role: UserRole = UserRole.OFFICER, superior: str | None = None
) -> User:
    return User(
        id=_id(0x3000 + n),
        email=f"{first[0]}{last}@cedarridgepd.example".lower(),
        first_name=first,
        last_name=last,
        title=title,
        employee_id=f"CR-{100 + n}",
        department_id=DEPARTMENT_ID,
        role=role,
        superior_email=superior and f"{superior}@cedarridgepd.example",
    )


USERS = [
    _user(1, "Renee", "Whitfield", TitleRank.CHIEF_OF_POLICE, UserRole.ADMIN),
    _user(2, "Tomas", "Brandt", TitleRank.LIEUTENANT, UserRole.ADMIN, "rwhitfield"),
    _user(3, "Maria", "Alvarez", TitleRank.SERGEANT, UserRole.ADMIN, "tbrandt"),
    _user(4, "James", "Chen", TitleRank.SERGEANT, superior="tbrandt"),
    _user(5, "Priya", "Natarajan", TitleRank.CORPORAL, superior="malvarez"),
    _user(6, "Daniel", "Okafor", TitleRank.OFFICER, superior="malvarez"),
    _user(7, "Sarah", "Kowalski", TitleRank.OFFICER, superior="malvarez"),
    _user(8, "Marcus", "Reed", TitleRank.OFFICER, superior="malvarez"),
    _user(9, "Elena", "Sorensen", TitleRank.CORPORAL, superior="jchen"),
    _user(10, "Andre", "Baptiste", TitleRank.OFFICER, superior="jchen"),
    _user(11, "Hannah", "Lindqvist", TitleRank.OFFICER, superior="jchen"),
    _user(12, "Victor", "Morales", TitleRank.OFFICER, superior="jchen"),
    _user(13, "Grace", "Oyelaran", TitleRank.DETECTIVE, superior="tbrandt"),
    _user(14, "Owen", "Fitzgerald", TitleRank.DISPATCHER, superior="tbrandt"),
]

_CHIEF, _LIEUTENANT = USERS[0], USERS[1]

GROUPS = [
    Group(id=_id(0x4001), department_id=DEPARTMENT_ID, name="A Squad", created_by=_LIEUTENANT.id),
    Group(id=_id(0x4002), department_id=DEPARTMENT_ID, name="B Squad", created_by=_LIEUTENANT.id),
    Group(id=_id(0x4003), department_id=DEPARTMENT_ID, name="Field Training Officers", created_by=_LIEUTENANT.id),
]

_MEMBERS = {
    0x4001: [3, 5, 6, 7, 8],
    0x4002: [4, 9, 10, 11, 12],
    0x4003: [5, 9],
}

GROUP_USERS = [
    GroupUser(group_id=_id(group), user_id=_id(0x3000 + n)) for group, members in _MEMBERS.items() for n in members
]


def notifications() -> list[UserNotification]:
    now = utcnow()
    rows = []
    for user in USERS:
        rows.append(
            UserNotification(
                title="Range qualification",
                message="Fall qualification runs the first two weeks of December. Sign-up sheet is at the front desk.",
                sender_id=_CHIEF.id,
                receiver_id=user.id,
                created_at=now - timedelta(days=3, hours=2),
                read=True,
            )
        )
    for n in _MEMBERS[0x4001]:
        rows.append(
            UserNotification(
                title="A Squad briefing moved",
                message="Thursday's briefing starts 15 minutes early. Body camera firmware update beforehand.",
                sender_id=_LIEUTENANT.id,
                receiver_id=_id(0x3000 + n),
                created_at=now - timedelta(hours=5),
            )
        )
    return rows
