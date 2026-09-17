from datetime import datetime, timezone

from app.services.event_service import EventService


service = EventService()

saved_event = service.get_event(
    "EVT-TEST-001"
)

print(
    service.event_exists("EVT-TEST-001")
)

print(saved_event)