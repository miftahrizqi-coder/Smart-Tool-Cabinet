from app.services.auth_context_service import auth_context_service
from app.services.pin_service_processor import PINEventProcessor
from app.schemas.pin import PINEvent

def test_invalid_pin():

    processor = PINEventProcessor()

    auth_context_service.create_context(
        event_id="RFID-002",
        employee_id="EMP-212BB6C8",
        cabinet_id="CAB-DF11099F"
    )

    event = PINEvent(
        eventId="PIN-002",
        eventType="auth.pin_entered",
        timestamp="2026-08-30T18:31:05+07:00",
        deviceId="ESP32-CAB-001",
        cabinetId="CAB-DF11099F",
        data={
            "pin": "999999"
        }
    )

    result = processor.process(
        event
    )

    assert result["status"] == "rejected"
    assert result["reason"] == "invalid_pin"