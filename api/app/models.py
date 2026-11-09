from enum import StrEnum

from pydantic import AwareDatetime, BaseModel


class Title(StrEnum):
    OFFICER = "Officer"
    CORPORAL = "Corporal"
    SERGEANT = "Sergeant"


class Department(BaseModel):
    timezone: str


class Officer(BaseModel):
    id: int
    name: str
    title: Title


class Shift(BaseModel):
    id: int
    starts_at: AwareDatetime
    ends_at: AwareDatetime
    officer_id: int
    required_title: Title | None = None
