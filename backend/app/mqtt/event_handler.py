from app.services.idempotency_service import (
    IdempotencyService
)

from app.schemas.mqtt import MQTTEvent


idempotency_service = IdempotencyService()

def handle_event(event: MQTTEvent):

    # ========================================================
    # IDEMPOTENCY CHECK
    # ========================================================

    accepted = idempotency_service.check_and_mark(
        event.eventId
    )

    if not accepted:

        print(
            f"[IDEMPOTENCY] "
            f"Duplicate event ignored: {event.eventId}"
        )

        return {
            "status": "ignored",
            "reason": "duplicate_event",
            "eventId": event.eventId
        }

    # ========================================================
    # EVENT PROCESSING
    # ========================================================

    print(
        f"[MQTT] Processing event: "
        f"{event.eventId}"
    )

    # lanjutkan ke event processor
    # process_event(event)

    return {
        "status": "processed",
        "eventId": event.eventId
    }