from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from app.models import Officer, Shift, Title

DEPARTMENT_TZ = ZoneInfo("America/Chicago")

OFFICERS = [
    Officer(id=1, name="Maria Alvarez", title=Title.SERGEANT),
    Officer(id=2, name="James Chen", title=Title.SERGEANT),
    Officer(id=3, name="Priya Natarajan", title=Title.CORPORAL),
    Officer(id=4, name="Daniel Okafor", title=Title.OFFICER),
    Officer(id=5, name="Sarah Kowalski", title=Title.OFFICER),
    Officer(id=6, name="Marcus Reed", title=Title.OFFICER),
]

# Start and end hour in department local time.
SLOTS = {
    "day": (6, 14),
    "evening": (14, 22),
    "night": (22, 6),
    "power": (18, 4),
}

# (weekday 0=Mon, slot, officer_id, required_title)
ROTA: list[tuple[int, str, int, Title | None]] = [
    (0, "day", 3, Title.CORPORAL),
    (0, "evening", 4, None),
    (0, "night", 1, None),
    (1, "day", 5, None),
    (1, "evening", 6, None),
    (1, "night", 2, None),
    (2, "day", 4, None),
    (2, "evening", 3, None),
    (2, "night", 1, None),
    (3, "day", 6, None),
    (3, "evening", 5, None),
    (3, "night", 2, None),
    (4, "day", 3, None),
    (4, "evening", 4, None),
    (4, "power", 6, None),
    (4, "night", 1, Title.SERGEANT),
    (5, "day", 5, None),
    (5, "evening", 3, None),
    (5, "power", 4, None),
    (5, "night", 2, Title.SERGEANT),
    (6, "day", 6, None),
    (6, "evening", 5, None),
    (6, "night", 1, None),
]


def _at(day: date, hour: int) -> datetime:
    return datetime.combine(day, time(hour), tzinfo=DEPARTMENT_TZ)


def schedule(today: date, weeks: int = 2) -> list[Shift]:
    """The ROTA repeated weekly, starting Monday of the week containing `today`."""
    monday = today - timedelta(days=today.weekday())
    shifts = []
    for week in range(weeks):
        for weekday, slot, officer_id, required_title in ROTA:
            day = monday + timedelta(weeks=week, days=weekday)
            start_hour, end_hour = SLOTS[slot]
            end_day = day + timedelta(days=1) if end_hour <= start_hour else day
            shifts.append(
                Shift(
                    id=len(shifts) + 1,
                    starts_at=_at(day, start_hour),
                    ends_at=_at(end_day, end_hour),
                    officer_id=officer_id,
                    required_title=required_title,
                )
            )
    return shifts
