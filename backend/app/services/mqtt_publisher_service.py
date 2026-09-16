import os
import ssl
import json
import logging

import paho.mqtt.client as mqtt
from dotenv import load_dotenv


load_dotenv()


logger = logging.getLogger(__name__)


class MQTTPublisherService:

    # ========================================================
    # CONFIGURATION
    # ========================================================

    MQTT_HOST = os.getenv(
        "MQTT_HOST"
    )

    MQTT_PORT = int(
        os.getenv(
            "MQTT_PORT",
            "8883"
        )
    )

    MQTT_USERNAME = os.getenv(
        "MQTT_USERNAME"
    )

    MQTT_PASSWORD = os.getenv(
        "MQTT_PASSWORD"
    )

    MQTT_CLIENT_ID = os.getenv(
        "MQTT_PUBLISHER_CLIENT_ID",
        "stc-backend-publisher"
    )

    # ========================================================
    # INIT
    # ========================================================

    def __init__(self):

        self.client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2,
            client_id=self.MQTT_CLIENT_ID
        )

        self.connected = False

        self._configure()

    # ========================================================
    # CONFIGURE
    # ========================================================

    def _configure(self):

        if not self.MQTT_HOST:

            raise ValueError(
                "MQTT_BROKER_HOST is not configured"
            )

        if not self.MQTT_USERNAME:

            raise ValueError(
                "MQTT_USERNAME is not configured"
            )

        if not self.MQTT_PASSWORD:

            raise ValueError(
                "MQTT_PASSWORD is not configured"
            )

        # ----------------------------------------------------
        # Authentication
        # ----------------------------------------------------

        self.client.username_pw_set(
            self.MQTT_USERNAME,
            self.MQTT_PASSWORD
        )

        # ----------------------------------------------------
        # TLS
        # ----------------------------------------------------

        self.client.tls_set(
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLS_CLIENT
        )

        # ----------------------------------------------------
        # Callbacks
        # ----------------------------------------------------

        self.client.on_connect = (
            self._on_connect
        )

        self.client.on_disconnect = (
            self._on_disconnect
        )

    # ========================================================
    # CONNECT
    # ========================================================

    def connect(self):

        if self.connected:
            return

        logger.info(
            "Connecting MQTT publisher to %s:%s",
            self.MQTT_HOST,
            self.MQTT_PORT
        )

        self.client.connect(
            self.MQTT_HOST,
            self.MQTT_PORT,
            keepalive=60
        )

        self.client.loop_start()

    # ========================================================
    # ON CONNECT
    # ========================================================

    def _on_connect(
        self,
        client,
        userdata,
        flags,
        reason_code,
        properties
    ):

        if reason_code == 0:

            self.connected = True

            logger.info(
                "MQTT publisher connected"
            )

        else:

            self.connected = False

            logger.error(
                "MQTT publisher connection failed: %s",
                reason_code
            )

    # ========================================================
    # ON DISCONNECT
    # ========================================================

    def _on_disconnect(
        self,
        client,
        userdata,
        disconnect_flags,
        reason_code,
        properties
    ):

        self.connected = False

        logger.warning(
            "MQTT publisher disconnected: %s",
            reason_code
        )

    # ========================================================
    # PUBLISH
    # ========================================================

    def publish(
        self,
        topic: str,
        payload: dict,
        qos: int = 1,
        retain: bool = False
    ):

        if not self.connected:

            self.connect()

        message = json.dumps(
            payload
        )

        logger.info(
            "Publishing MQTT message: topic=%s",
            topic
        )

        result = self.client.publish(
            topic,
            message,
            qos=qos,
            retain=retain
        )

        if result.rc != mqtt.MQTT_ERR_SUCCESS:

            raise RuntimeError(
                f"MQTT publish failed: {result.rc}"
            )

        return {
            "status": "published",
            "topic": topic,
            "messageId": result.mid
        }

    # ========================================================
    # PUBLISH COMMAND
    # ========================================================

    def publish_command(
        self,
        cabinet_id: str,
        command: str,
        command_id: str,
        target: str = "LOCK"
    ):

        topic = (
            f"smart-cabinet/"
            f"{cabinet_id}/"
            f"command"
        )

        payload = {
            "commandId": command_id,
            "command": command,
            "cabinetId": cabinet_id,
            "target": target
        }

        return self.publish(
            topic=topic,
            payload=payload,
            qos=1,
            retain=False
        )

    # ========================================================
    # DISCONNECT
    # ========================================================

    def disconnect(self):

        if not self.connected:
            return

        logger.info(
            "Disconnecting MQTT publisher"
        )

        self.client.loop_stop()

        self.client.disconnect()

        self.connected = False