from fastapi.testclient import TestClient

from src import seed
from src.models import UserRole
from tests.conftest import get_headers, make_user

BASE_URL = "/api/v1/groups"


def test_admin_lists_groups_with_members(local_client: TestClient):
    response = local_client.get(BASE_URL, headers=get_headers(make_user(UserRole.ADMIN)))

    assert response.status_code == 200, response.text
    groups = response.json()
    assert [group["name"] for group in groups] == ["A Squad", "B Squad", "Field Training Officers"]
    assert len(groups[0]["members"]) == 5


def test_officer_forbidden(local_client: TestClient):
    response = local_client.get(BASE_URL, headers=get_headers(make_user(UserRole.OFFICER)))

    assert response.status_code == 403
    assert response.json() == {"detail": "User is not allowed to perform this action"}


def test_create_assign_and_delete(local_client: TestClient):
    headers = get_headers(make_user(UserRole.ADMIN))
    officer = make_user(UserRole.OFFICER)

    created = local_client.post(BASE_URL, json={"name": "  Night Watch "}, headers=headers)
    assert created.status_code == 201, created.text
    group = created.json()
    assert group["name"] == "Night Watch"
    assert group["members"] == []

    assigned = local_client.post(
        f"{BASE_URL}/{group['id']}/assign", json={"userIds": [str(officer.id)]}, headers=headers
    )
    assert [member["id"] for member in assigned.json()["members"]] == [str(officer.id)]

    assert local_client.delete(f"{BASE_URL}/{group['id']}", headers=headers).status_code == 204
    assert local_client.delete(f"{BASE_URL}/{group['id']}", headers=headers).status_code == 404


def test_duplicate_name_conflicts_case_insensitively(local_client: TestClient):
    response = local_client.post(BASE_URL, json={"name": "a squad"}, headers=get_headers(make_user(UserRole.ADMIN)))

    assert response.status_code == 409
    assert response.json() == {"message": "A group named 'a squad' already exists"}


def test_assigning_user_outside_roster_is_rejected(local_client: TestClient):
    headers = get_headers(make_user(UserRole.ADMIN))
    group_id = seed.GROUPS[0].id

    response = local_client.post(
        f"{BASE_URL}/{group_id}/assign", json={"userIds": ["00000000-0000-0000-0000-00000000dead"]}, headers=headers
    )

    assert response.status_code == 400
