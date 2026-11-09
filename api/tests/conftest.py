from datetime import date

import pytest
from fastapi.testclient import TestClient

from app.main import app, get_store
from app.store import seeded_store


@pytest.fixture
def client():
    store = seeded_store(today=date(2026, 11, 9))
    app.dependency_overrides[get_store] = lambda: store
    yield TestClient(app)
    app.dependency_overrides.clear()
