from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import Department, Officer, Shift
from app.store import Store, seeded_store

app = FastAPI(title="Shift Swap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_store = seeded_store()


def get_store() -> Store:
    return _store


StoreDep = Annotated[Store, Depends(get_store)]


@app.get("/department")
def get_department(store: StoreDep) -> Department:
    return store.department


@app.get("/officers")
def list_officers(store: StoreDep) -> list[Officer]:
    return sorted(store.officers.values(), key=lambda o: o.name)


@app.get("/shifts")
def list_shifts(store: StoreDep, officer_id: int | None = None) -> list[Shift]:
    shifts = list(store.shifts.values())
    if officer_id is not None:
        shifts = [s for s in shifts if s.officer_id == officer_id]
    return sorted(shifts, key=lambda s: s.starts_at)
