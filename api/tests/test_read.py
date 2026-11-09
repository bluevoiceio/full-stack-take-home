from datetime import datetime


def test_returns_department_time_zone(client):
    response = client.get("/department")

    assert response.status_code == 200
    assert response.json() == {"timezone": "America/Chicago"}


def test_lists_officers(client):
    response = client.get("/officers")

    assert response.status_code == 200
    officers = response.json()
    assert len(officers) == 6
    assert {"id", "name", "title"} <= officers[0].keys()


def test_lists_shifts_in_start_order_with_offsets(client):
    response = client.get("/shifts")

    assert response.status_code == 200
    starts = [datetime.fromisoformat(s["starts_at"]) for s in response.json()]
    assert starts == sorted(starts)
    assert all(start.tzinfo is not None for start in starts)


def test_filters_shifts_by_officer(client):
    response = client.get("/shifts", params={"officer_id": 1})

    assert response.status_code == 200
    shifts = response.json()
    assert shifts
    assert all(s["officer_id"] == 1 for s in shifts)
