from datetime import datetime

from fastapi.testclient import TestClient

from src import seed
from src.models import UserRole
from tests.conftest import get_headers, make_user


def test_login_returns_a_token_that_resolves_to_the_user(local_client: TestClient):
    login = local_client.post("/auth/login", json={"email": "DOkafor@cedarridgepd.example"})

    assert login.status_code == 200, login.text
    token = login.json()["accessToken"]
    me = local_client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.json()["email"] == "dokafor@cedarridgepd.example"
    assert me.json()["title"] == "Officer"


def test_roster_is_sorted_by_last_name(local_client: TestClient):
    response = local_client.get("/api/v1/users", headers=get_headers(make_user(UserRole.OFFICER)))

    last_names = [user["lastName"] for user in response.json()]
    assert len(last_names) == len(seed.USERS)
    assert last_names == sorted(last_names)


def test_department_and_units(local_client: TestClient):
    headers = get_headers(make_user(UserRole.OFFICER))

    department = local_client.get(f"/api/v1/departments/{seed.DEPARTMENT_ID}", headers=headers)
    assert department.json()["timezone"] == "America/Chicago"

    other = local_client.get("/api/v1/departments/00000000-0000-0000-0000-00000000beef", headers=headers)
    assert other.status_code == 403

    units = local_client.get("/api/v1/units", headers=headers).json()
    assert [unit["name"] for unit in units] == ["Dispatch", "Investigations", "Patrol"]


def test_timestamps_have_no_offset(local_client: TestClient):
    headers = get_headers(make_user(UserRole.OFFICER))

    created_at = local_client.get("/api/v1/notifications", headers=headers).json()[0]["createdAt"]

    assert datetime.fromisoformat(created_at).tzinfo is None
