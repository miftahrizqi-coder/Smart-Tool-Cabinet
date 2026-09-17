import json
import logging
from typing import Optional

import paho.mqtt.client as mqtt

from app.core.config import settings


logger = logging.getLogger(__name__)


class MQTTClient:
    """
    MQTT client untuk Smart Tool Cabinet.

    Tanggung jawab pada Phase 7.4.2:
    - Connect ke HiveMQ Cloud
    - TLS
    - Subscribe event/status topic
    - Menerima MQTT message
    - Parse JSON
    - Logging event

    Belum melakukan:
    - Transaction processing
    - Firestore write
    - Employee validation
    - Tool validation
    """

    def __init__(self):
        self.client: Optional[mqtt.Client] = None
        self.connected = False

    # ==================================================
    # CREATE CLIENT
    # ==================================================

    def create_client(self) -> mqtt.Client:

        client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2,
            client_id=settings.mqtt_client_id,
            protocol=mqtt.MQTTv5,
        )

        # ------------------------------------------------
        # Username & Password
        # ------------------------------------------------

        client.username_pw_set(
            username=settings.mqtt_username,
            password=settings.mqtt_password,
        )

        # ------------------------------------------------
        # TLS
        # ------------------------------------------------

        if settings.mqtt_use_tls:
            client.tls_set()

        # ------------------------------------------------
        # Callbacks
        # ------------------------------------------------

        client.on_connect = self.on_connect
        client.on_disconnect = self.on_disconnect
        client.on_message = self.on_message
        client.on_subscribe = self.on_subscribe
        client.on_publish = self.on_publish

        return client

    # ==================================================
    # CONNECT
    # ==================================================

    def connect(self):

        print(">>> MQTT CONNECT FUNCTION CALLED")

        if self.client is not None:
            print(">>> MQTT client already initialized")
            logger.warning(
                "MQTT client already initialized."
            )
            return

        try:

            print(">>> Creating MQTT client")

            logger.info(
                "Connecting to MQTT broker %s:%s",
                settings.mqtt_host,
                settings.mqtt_port,
            )

            self.client = self.create_client()

            print(">>> MQTT client created")

            self.client.connect(
                host=settings.mqtt_host,
                port=settings.mqtt_port,
                keepalive=60,
            )

            print(">>> MQTT connect() executed")

            self.client.loop_start()

            print(">>> MQTT loop started")

            logger.info(
                "MQTT network loop started."
            )

        except Exception:

            print(">>> MQTT CONNECTION ERROR")

            logger.exception(
                "Failed to connect to MQTT broker."
            )

            self.client = None

            raise

    # ==================================================
    # DISCONNECT
    # ==================================================

    def disconnect(self):

        if self.client is None:
            return

        try:

            logger.info(
                "Disconnecting MQTT client..."
            )

            self.client.loop_stop()

            self.client.disconnect()

        except Exception:

            logger.exception(
                "Error while disconnecting MQTT."
            )

        finally:

            self.client = None
            self.connected = False

    # ==================================================
    # ON CONNECT
    # ==================================================

    def on_connect(
        self,
        client,
        userdata,
        flags,
        reason_code,
        properties=None,
    ):

        print(">>> MQTT ON_CONNECT CALLED")
        print(f">>> MQTT REASON CODE: {reason_code}")

        logger.info(
            "MQTT connected. Reason code: %s",
            reason_code,
        )

        if reason_code.is_failure:

            print(">>> MQTT CONNECTION FAILED")

            self.connected = False
            return

        print(">>> MQTT CONNECTION SUCCESS")

        self.connected = True

        result_events, mid_events = client.subscribe(
            settings.mqtt_events_topic,
            qos=1,
        )

        print(
            f">>> SUBSCRIBE EVENTS RESULT: {result_events}"
        )

        result_status, mid_status = client.subscribe(
            settings.mqtt_status_topic,
            qos=1,
        )

        print(
            f">>> SUBSCRIBE STATUS RESULT: {result_status}"
        )

        # ------------------------------------------------
        # Subscribe status
        # ------------------------------------------------

        result_status, mid_status = client.subscribe(
            settings.mqtt_status_topic,
            qos=1,
        )

        if result_status != mqtt.MQTT_ERR_SUCCESS:

            logger.error(
                "Failed to subscribe to status topic: %s",
                settings.mqtt_status_topic,
            )

        else:

            logger.info(
                "Subscribed to status topic: %s",
                settings.mqtt_status_topic,
            )

    # ==================================================
    # ON DISCONNECT
    # ==================================================

    def on_disconnect(
        self,
        client,
        userdata,
        disconnect_flags,
        reason_code,
        properties=None,
    ):

        self.connected = False

        logger.warning(
            "MQTT disconnected. Reason code: %s",
            reason_code,
        )

    # ==================================================
    # ON SUBSCRIBE
    # ==================================================

    def on_subscribe(
        self,
        client,
        userdata,
        mid,
        reason_codes,
        properties=None,
    ):

        logger.info(
            "MQTT subscription confirmed. "
            "MID=%s, reason=%s",
            mid,
            reason_codes,
        )

    # ==================================================
    # ON PUBLISH
    # ==================================================

    def on_publish(
        self,
        client,
        userdata,
        mid,
        reason_code=None,
        properties=None,
    ):

        logger.debug(
            "MQTT message published. MID=%s",
            mid,
        )

    # ==================================================
    # ON MESSAGE
    # ==================================================

    def on_message(
        self,
        client,
        userdata,
        message,
    ):

        logger.info(
            "MQTT message received."
        )

        logger.info(
            "Topic: %s",
            message.topic,
        )

        try:

            payload = message.payload.decode(
                "utf-8"
            )

            logger.info(
                "Payload: %s",
                payload,
            )

        except UnicodeDecodeError:

            logger.exception(
                "MQTT payload is not valid UTF-8."
            )

            return

        # ------------------------------------------------
        # Parse JSON
        # ------------------------------------------------

        try:

            data = json.loads(payload)

        except json.JSONDecodeError:

            logger.error(
                "MQTT payload is not valid JSON."
            )

            return

        # ------------------------------------------------
        # Log parsed event
        # ------------------------------------------------

        logger.info(
            "Parsed MQTT data: %s",
            data,
        )

        # ------------------------------------------------
        # Phase 7.4.2 ONLY
        #
        # Jangan process transaction di sini dulu.
        # Event routing akan dibuat pada tahap berikutnya.
        # ------------------------------------------------

        event_type = data.get(
            "eventType"
        )

        event_id = data.get(
            "eventId"
        )

        device_id = data.get(
            "deviceId"
        )

        cabinet_id = data.get(
            "cabinetId"
        )

        logger.info(
            "MQTT EVENT | "
            "eventId=%s | "
            "eventType=%s | "
            "deviceId=%s | "
            "cabinetId=%s",
            event_id,
            event_type,
            device_id,
            cabinet_id,
        )


# ======================================================
# SINGLETON MQTT CLIENT
# ======================================================

mqtt_client = MQTTClient()