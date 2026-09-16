from app.services.tool_event_processor import (
    ToolEventProcessor
)

from app.services.rfid_event_processor import (
    RFIDEventProcessor
)

from app.services.mqtt_event_dispatcher import (
    MQTTEventDispatcher
)

from app.services.mqtt_message_handler import (
    MQTTMessageHandler
)

from app.services.mqtt_subscriber_service import (
    MQTTSubscriberService
)

from app.services.mqtt_publisher_service import (
    MQTTPublisherService
)

from app.services.mqtt_command_service import (
    MQTTCommandService
)

from app.services.pin_service_processor import (
    PINEventProcessor
)


# ============================================================
# PUBLISHER
# ============================================================

mqtt_publisher = (
    MQTTPublisherService()
)


# ============================================================
# COMMAND SERVICE
# ============================================================

mqtt_command_service = (
    MQTTCommandService(
        publisher=mqtt_publisher
    )
)


# ============================================================
# TOOL PROCESSOR
# ============================================================

tool_event_processor = (
    ToolEventProcessor()
)


# ============================================================
# PIN PROCESSOR
# ============================================================

pin_event_processor = (
    PINEventProcessor(
        mqtt_publisher=mqtt_publisher
    )
)


# ============================================================
# RFID PROCESSOR
# ============================================================

rfid_event_processor = (
    RFIDEventProcessor()
)


# ============================================================
# EVENT DISPATCHER
# ============================================================

mqtt_event_dispatcher = (
    MQTTEventDispatcher(
        tool_processor=tool_event_processor,
        rfid_processor=rfid_event_processor,
        pin_processor=pin_event_processor
    )
)


# ============================================================
# MESSAGE HANDLER
# ============================================================

mqtt_message_handler = (
    MQTTMessageHandler(
        dispatcher=mqtt_event_dispatcher
    )
)


# ============================================================
# SUBSCRIBER
# ============================================================

mqtt_subscriber = (
    MQTTSubscriberService(
        message_handler=mqtt_message_handler
    )
)