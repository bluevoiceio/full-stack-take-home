from datetime import date, datetime

from app.models import Department, Officer, Shift
from app.seed import DEPARTMENT_TZ, OFFICERS, schedule


class Store:
    """In-memory data. Everything resets when the server restarts."""

    def __init__(self, department: Department, officers: list[Officer], shifts: list[Shift]) -> None:
        self.department = department
        self.officers = {o.id: o for o in officers}
        self.shifts = {s.id: s for s in shifts}


def seeded_store(today: date | None = None) -> Store:
    today = today or datetime.now(DEPARTMENT_TZ).date()
    return Store(
        department=Department(timezone=DEPARTMENT_TZ.key),
        officers=[o.model_copy() for o in OFFICERS],
        shifts=schedule(today),
    )
