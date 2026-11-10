from fastapi.testclient import TestClient

from src import seed
from src.models import UserRole
from tests.conftest import get_headers, make_user

BASE_URL = "/api/v1/notifications"


def test_requires_a_token(local_client: TestClient):
    assert local_client.get(BASE_URL).status_code in (401, 403)
    assert local_client.get(BASE_URL, headers={"Authorization": "Bearer nope"}).status_code == 401


def test_notifying_a_group_reaches_each_member_once(local_client: TestClient):
    admin = make_user(UserRole.ADMIN)
    a_squad = seed.GROUPS[0]
    member = next(user for user in seed.USERS if user.email.startswith("dokafor"))
    before = len(local_client.get(BASE_URL, headers=get_headers(member)).json())

    sent = local_client.post(
        BASE_URL,
        json={
            "title": "Roll call",
            "message": "0545 sharp.",
            "groupIds": [str(a_squad.id)],
            "userIds": [str(member.id)],
        },
        headers=get_headers(admin),
    )

    assert sent.status_code == 201, sent.text
    assert sent.json() == {"recipientCount": 5}
    inbox = local_client.get(BASE_URL, headers=get_headers(member)).json()
    assert len(inbox) == before + 1
    assert inbox[0]["title"] == "Roll call"
    assert inbox[0]["read"] is False


def test_officer_cannot_send(local_client: TestClient):
    officer = make_user(UserRole.OFFICER)

    response = local_client.post(
        BASE_URL, json={"title": "Hi", "message": "Hi", "userIds": [str(officer.id)]}, headers=get_headers(officer)
    )

    assert response.status_code == 403


def test_mark_read_and_delete_only_your_own(local_client: TestClient):
    officer = make_user(UserRole.OFFICER)
    admin = make_user(UserRole.ADMIN)
    notification = local_client.get(BASE_URL, headers=get_headers(officer)).json()[0]
    url = f"{BASE_URL}/{notification['id']}"

    assert local_client.patch(url, json={"read": True}, headers=get_headers(admin)).status_code == 404
    assert local_client.patch(url, json={"read": True}, headers=get_headers(officer)).json()["read"] is True
    assert local_client.delete(url, headers=get_headers(officer)).status_code == 204
    assert local_client.delete(url, headers=get_headers(officer)).status_code == 404
