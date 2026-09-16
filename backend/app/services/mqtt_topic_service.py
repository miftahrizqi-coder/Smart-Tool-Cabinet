class MQTTTopicService:

    ROOT = "smart-cabinet"

    VALID_CHANNELS = {
        "rfid",
        "pin",
        "tool",
        "status"
    }

    @classmethod
    def parse_topic(
        cls,
        topic: str
    ) -> dict:

        parts = topic.split("/")

        # Expected:
        # smart-cabinet/{cabinetId}/{channel}

        if len(parts) != 3:
            raise ValueError(
                "Invalid MQTT topic structure"
            )

        root = parts[0]
        cabinet_id = parts[1]
        channel = parts[2]

        if root != cls.ROOT:
            raise ValueError(
                "Invalid MQTT topic root"
            )

        if not cabinet_id:
            raise ValueError(
                "Missing cabinetId in MQTT topic"
            )

        if channel not in cls.VALID_CHANNELS:
            raise ValueError(
                f"Unsupported MQTT channel: {channel}"
            )

        return {
            "cabinetId": cabinet_id,
            "channel": channel
        }