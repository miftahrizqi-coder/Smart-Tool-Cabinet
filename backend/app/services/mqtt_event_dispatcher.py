from typing import Any


class MQTTEventDispatcher:

    def __init__(
        self,
        rfid_processor=None,
        pin_processor=None,
        tool_processor=None,
        status_processor=None
    ):

        self.rfid_processor = rfid_processor
        self.pin_processor = pin_processor
        self.tool_processor = tool_processor
        self.status_processor = status_processor

    # ========================================================
    # DISPATCH
    # ========================================================

    def dispatch(
        self,
        channel: str,
        event: Any
    ):

        # ====================================================
        # RFID
        # ====================================================

        if channel == "rfid":

            if self.rfid_processor is None:
                raise RuntimeError(
                    "RFID processor is not configured"
                )

            return self.rfid_processor.process(
                event
            )

        # ====================================================
        # PIN
        # ====================================================

        if channel == "pin":

            if self.pin_processor is None:
                raise RuntimeError(
                    "PIN processor is not configured"
                )

            return self.pin_processor.process(
                event
            )

        # ====================================================
        # TOOL
        # ====================================================

        if channel == "tool":

            if self.tool_processor is None:
                raise RuntimeError(
                    "Tool processor is not configured"
                )

            return self.tool_processor.process(
                event
            )

        # ====================================================
        # STATUS
        # ====================================================

        if channel == "status":

            if self.status_processor is None:
                raise RuntimeError(
                    "Status processor is not configured"
                )

            return self.status_processor.process(
                event
            )

        # ====================================================
        # UNKNOWN CHANNEL
        # ====================================================

        raise ValueError(
            f"Unsupported MQTT channel: {channel}"
        )