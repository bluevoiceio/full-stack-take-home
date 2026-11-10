from typing import Generator

import pytest
from fastapi.testclient import TestClient

from src import seed
from src.db import init_engine
from src.main import app
from src.models import User, UserRole


@pytest.fixture
def local_client() -> Generator[TestClient, None, None]:
    """A client over a fresh, seeded, in-memory database."""
    init_engine("sqlite://")
    yield TestClient(app)


def get_headers(user: User) -> dict[str, str]:
    return {"Authorization": f"Bearer {user.id}"}


def make_user(role: UserRole) -> User:
    return next(user for user in seed.USERS if user.role == role)
