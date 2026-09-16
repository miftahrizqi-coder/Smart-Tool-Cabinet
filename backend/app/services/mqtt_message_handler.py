import logging
from app.services.event_service import EventService
from app.services.mqtt_payload_validator import (
    MQTTPayloadValidator
)

from app.services.mqtt_event_dispatcher import (
    MQTTEventDispatcher
)


logger = logging.getLogger(__name__)


class MQTTMessageHandler:

    def __init__(
        self,
        dispatcher: MQTTEventDispatcher,
        event_service: EventService | None = None
    ):
        self.dispatcher = dispatcher

        self.event_service = (
            event_service
            if event_service is not None
            else EventService()
        )

    # ========================================================
    # HANDLE MESSAGE
    # ========================================================

    def handle(
        self,
        topic: str,
        payload: bytes
    ):

        # ====================================================
        # VALIDATE
        # ====================================================

        try:

            validation_result = (
                MQTTPayloadValidator.validate(
                    topic=topic,
                    raw_payload=payload
                )
            )

        except Exception as exc:

            logger.warning(
                "MQTT message rejected: %s",
                str(exc)
            )

            return {
                "status": "rejected",
                "reason": str(exc)
            }

        # ====================================================
        # EXTRACT
        # ====================================================

        channel = validation_result[
            "channel"
        ]

        event = validation_result[
            "event"
        ]

        # ====================================================
        # DISPATCH
        # ====================================================

        try:
            result = self.dispatcher.dispatch(
                channel=channel,
                event=event
            )

            self.event_service.create_event(
                event_id=event.eventId,
                event_type=event.eventType,
                channel=channel,
                cabinet_id=event.cabinetId,
                timestamp=event.timestamp,
                status=result.get("status", "unknown"),
                result=result
            )

            return result

        except Exception as exc:
            logger.exception("MQTT event processing failed")

            return {
                "status": "error",
                "reason": str(exc),
                "eventId": getattr(event, "eventId", None)
            }