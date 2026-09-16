from app.schemas.rfid import RFIDEvent
from app.services.rfid_event_processor import (
    RFIDEventProcessor
)


def test_duplicate_rfid_event():

    processor = RFIDEventProcessor()

    event = RFIDEvent(
        eventId="TEST-RFID-003",
        eventType="rfid.card_tapped",
        timestamp="2026-08-30T18:32:00+07:00",
        deviceId="ESP32-CAB-001",
        cabinetId="CAB-001",
        data={
            "uid": "ABC123"
        }
    )

    first = processor.process(event)
    second = processor.process(event)

    assert first["status"] == "authenticated"

    assert second["status"] == "ignored"
    assert second["reason"] == "duplicate_event"