from contextlib import contextmanager
from typing import Generator

from sqlalchemy import Engine, event
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine, select

from src import seed
from src.api import settings
from src.models import Department

_engine: Engine | None = None


def init_engine(url: str = settings.DATABASE_URL) -> Engine:
    """Create the engine and tables, and seed an empty database."""
    global _engine
    in_memory = url in ("sqlite://", "sqlite:///:memory:")
    _engine = create_engine(
        url,
        connect_args={"check_same_thread": False},
        **({"poolclass": StaticPool} if in_memory else {}),
    )

    @event.listens_for(_engine, "connect")
    def _enable_foreign_keys(dbapi_connection, _record):
        dbapi_connection.execute("PRAGMA foreign_keys=ON")

    SQLModel.metadata.create_all(_engine)
    _seed_if_empty()
    return _engine


@contextmanager
def get_session() -> Generator[Session, None, None]:
    """Every DB method opens its own session and commits its own work."""
    if _engine is None:
        raise RuntimeError("init_engine() has not been called")
    with Session(_engine, expire_on_commit=False) as session:
        yield session


def _seed_if_empty() -> None:
    with get_session() as session:
        if session.exec(select(Department)).first() is not None:
            return
        # Parents are committed before the rows that reference them.
        for rows in ([seed.DEPARTMENT], [*seed.UNITS, *seed.GROUPS], [*seed.GROUP_USERS, *seed.notifications()]):
            session.add_all(type(row)(**row.model_dump()) for row in rows)
            session.commit()
