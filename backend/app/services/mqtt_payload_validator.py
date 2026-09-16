import json
from typing import Any

from pydantic import ValidationError

from app.schemas.mqtt import MQTTEventBase

from app.schemas.rfid import RFIDEvent
from app.schemas.pin import PINEvent
from app.schemas.tool_event import ToolSlotEvent
from app.schemas.device_status import DeviceStatusEvent

from app.services.mqtt_topic_service import (
    MQTTTopicService
)


class MQTTPayloadValidator:

    EVENT_TYPE_BY_CHANNEL = {
        "rfid": "rfid.card_tapped",
        "pin": "auth.pin_entered",
        "tool": "tool.slot_changed",
        "status": "device.status_changed"
    }

    SCHEMA_BY_CHANNEL = {
        "rfid": RFIDEvent,
        "pin": PINEvent,
        "tool": ToolSlotEvent,
        "status": DeviceStatusEvent
    }

    @classmethod
    def validate(
        cls,
        topic: str,
        raw_payload: bytes | str
    ) -> dict[str, Any]:

        # ====================================================
        # 1. TOPIC
        # ====================================================

        topic_data = MQTTTopicService.parse_topic(
            topic
        )

        cabinet_id_from_topic = (
            topic_data["cabinetId"]
        )

        channel = topic_data["channel"]

        # ====================================================
        # 2. DECODE PAYLOAD
        # ====================================================

        if isinstance(raw_payload, bytes):
            raw_payload = raw_payload.decode(
                "utf-8"
            )

        # ====================================================
        # 3. JSON
        # ====================================================

        try:
            payload = json.loads(
                raw_payload
            )

        except json.JSONDecodeError as exc:
            raise ValueError(
                "Invalid JSON payload"
            ) from exc

        # ====================================================
        # 4. COMMON ENVELOPE
        # ====================================================

        MQTTEventBase.model_validate(
            payload
        )

        # ====================================================
        # 5. CABINET MATCH
        # ====================================================

        cabinet_id_from_payload = (
            payload["cabinetId"]
        )

        if (
            cabinet_id_from_topic
            != cabinet_id_from_payload
        ):

            raise ValueError(
                "cabinetId in topic does not match "
                "cabinetId in payload"
            )

        # ====================================================
        # 6. EVENT TYPE MATCH CHANNEL
        # ====================================================

        expected_event_type = (
            cls.EVENT_TYPE_BY_CHANNEL[
                channel
            ]
        )

        if (
            payload["eventType"]
            != expected_event_type
        ):

            raise ValueError(
                "eventType does not match "
                f"MQTT channel '{channel}'"
            )

        # ====================================================
        # 7. EVENT-SPECIFIC SCHEMA
        # ====================================================

        schema = cls.SCHEMA_BY_CHANNEL[
            channel
        ]

        validated_event = (
            schema.model_validate(
                payload
            )
        )

        return {
            "status": "valid",
            "channel": channel,
            "cabinetId": (
                cabinet_id_from_topic
            ),
            "event": validated_event
        }