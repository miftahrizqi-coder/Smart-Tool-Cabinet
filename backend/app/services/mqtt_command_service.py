from datetime import datetime, timezone
from uuid import uuid4

from app.services.mqtt_publisher_service import (
    MQTTPublisherService
)


class MQTTCommandService:

    # ========================================================
    # ALLOWED COMMANDS
    # ========================================================

    ALLOWED_COMMANDS = {
        "UNLOCK",
        "LOCK"
    }

    # ========================================================
    # ALLOWED TARGETS
    # ========================================================

    ALLOWED_TARGETS = {
        "LOCK"
    }

    # ========================================================
    # INIT
    # ========================================================

    def __init__(
        self,
        publisher: MQTTPublisherService
    ):

        self.publisher = publisher

    # ========================================================
    # VALIDATE CABINET
    # ========================================================

    def _validate_cabinet_id(
        self,
        cabinet_id: str
    ):

        if not cabinet_id:

            raise ValueError(
                "cabinet_id is required"
            )

        if not isinstance(
            cabinet_id,
            str
        ):

            raise ValueError(
                "cabinet_id must be a string"
            )

    # ========================================================
    # VALIDATE COMMAND
    # ========================================================

    def _validate_command(
        self,
        command: str
    ):

        if not command:

            raise ValueError(
                "command is required"
            )

        command = command.upper()

        if command not in self.ALLOWED_COMMANDS:

            raise ValueError(
                f"Unsupported MQTT command: {command}"
            )

        return command

    # ========================================================
    # VALIDATE TARGET
    # ========================================================

    def _validate_target(
        self,
        target: str
    ):

        if not target:

            raise ValueError(
                "target is required"
            )

        target = target.upper()

        if target not in self.ALLOWED_TARGETS:

            raise ValueError(
                f"Unsupported MQTT target: {target}"
            )

        return target

    # ========================================================
    # CREATE COMMAND ID
    # ========================================================

    def _generate_command_id(self):

        return (
            f"CMD-{uuid4().hex[:8].upper()}"
        )

    # ========================================================
    # BUILD PAYLOAD
    # ========================================================

    def _build_payload(
        self,
        command_id: str,
        command: str,
        cabinet_id: str,
        target: str
    ):

        return {
            "commandId": command_id,
            "command": command,
            "cabinetId": cabinet_id,
            "target": target,
            "timestamp": (
                datetime.now(
                    timezone.utc
                ).isoformat()
            )
        }

    # ========================================================
    # SEND COMMAND
    # ========================================================

    def send_command(
        self,
        cabinet_id: str,
        command: str,
        target: str = "LOCK",
        command_id: str | None = None
    ):

        # ----------------------------------------------------
        # Validation
        # ----------------------------------------------------

        self._validate_cabinet_id(
            cabinet_id
        )

        command = self._validate_command(
            command
        )

        target = self._validate_target(
            target
        )

        # ----------------------------------------------------
        # Command ID
        # ----------------------------------------------------

        if command_id is None:

            command_id = (
                self._generate_command_id()
            )

        # ----------------------------------------------------
        # Build payload
        # ----------------------------------------------------

        payload = self._build_payload(
            command_id=command_id,
            command=command,
            cabinet_id=cabinet_id,
            target=target
        )

        # ----------------------------------------------------
        # Publish
        # ----------------------------------------------------

        result = self.publisher.publish(
            topic=(
                f"smart-cabinet/"
                f"{cabinet_id}/"
                f"command"
            ),
            payload=payload,
            qos=1,
            retain=False
        )

        # ----------------------------------------------------
        # Return result
        # ----------------------------------------------------

        return {
            "status": "accepted",
            "commandId": command_id,
            "command": command,
            "cabinetId": cabinet_id,
            "target": target,
            "timestamp": payload["timestamp"],
            "mqtt": result
        }