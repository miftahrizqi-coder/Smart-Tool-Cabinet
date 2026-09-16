from app.services.idempotency_service import (
    IdempotencyService
)

def test_duplicate_reed_switch_event():

    service = IdempotencyService()

    events = [
        "EVT-001",
        "EVT-001",
        "EVT-001",
        "EVT-001"
    ]

    results = [
        service.check_and_mark(event_id)
        for event_id in events
    ]

    assert results == [
        True,
        False,
        False,
        False
    ]