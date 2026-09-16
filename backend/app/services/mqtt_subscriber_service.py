import os
import ssl
import logging

import paho.mqtt.client as mqtt
from dotenv import load_dotenv

from app.services.mqtt_message_handler import (
    MQTTMessageHandler
)


load_dotenv()


logger = logging.getLogger(__name__)


class MQTTSubscriberService:

    # ========================================================
    # CONFIGURATION
    # ========================================================

    MQTT_BROKER_HOST = os.getenv(
        "MQTT_HOST"
    )

    MQTT_BROKER_PORT = int(
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
        "MQTT_CLIENT_ID",
        "stc-backend-subscriber"
    )

    # ========================================================
    # TOPICS
    # ========================================================

    TOPICS = [
        (
            "smart-cabinet/+/rfid",
            1
        ),
        (
            "smart-cabinet/+/pin",
            1
        ),
        (
            "smart-cabinet/+/tool",
            1
        ),
        (
            "smart-cabinet/+/status",
            1
        )
    ]

    # ========================================================
    # INIT
    # ========================================================

    def __init__(
        self,
        message_handler: MQTTMessageHandler
    ):

        self.message_handler = (
            message_handler
        )

        self.client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2,
            client_id=self.MQTT_CLIENT_ID
        )

        self.connected = False
        self.started = False

        self._configure()

    # ========================================================
    # CONFIGURE
    # ========================================================

    def _configure(self):

        if not self.MQTT_BROKER_HOST:
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

        self.client.username_pw_set(
            self.MQTT_USERNAME,
            self.MQTT_PASSWORD
        )

        self.client.tls_set(
            cert_reqs=ssl.CERT_REQUIRED,
            tls_version=ssl.PROTOCOL_TLS_CLIENT
        )

        self.client.on_connect = (
            self._on_connect
        )

        self.client.on_message = (
            self._on_message
        )

        self.client.on_disconnect = (
            self._on_disconnect
        )

    # ========================================================
    # CONNECT CALLBACK
    # ========================================================

    def _on_connect(
        self,
        client,
        userdata,
        flags,
        reason_code,
        properties
    ):

        print()
        print("========================================")
        print("MQTT ON_CONNECT CALLBACK")
        print("========================================")
        print("REASON CODE:", reason_code)
        print("REASON:", str(reason_code))
        print()

        if reason_code != 0:

            print(
                "MQTT CONNECTION FAILED"
            )

            self.connected = False

            return

        self.connected = True

        print(
            "MQTT SUBSCRIBER CONNECTED"
        )

        print()

        for topic, qos in self.TOPICS:

            result, mid = client.subscribe(
                topic,
                qos=qos
            )

            print(
                "SUBSCRIBE:",
                topic
            )

            print(
                "RESULT:",
                result
            )

            print(
                "MID:",
                mid
            )

            print()

    # ========================================================
    # MESSAGE CALLBACK
    # ========================================================

    def _on_message(
        self,
        client,
        userdata,
        message
    ):

        print()
        print("========================================")
        print("MQTT MESSAGE RECEIVED")
        print("========================================")
        print("TOPIC   :", message.topic)
        print(
            "PAYLOAD :",
            message.payload.decode("utf-8")
        )
        print("QOS     :", message.qos)
        print("========================================")

        try:

            result = self.message_handler.handle(
                topic=message.topic,
                payload=message.payload
            )

            print("HANDLER RESULT:")
            print(result)

        except Exception as e:

            print("MQTT MESSAGE HANDLER ERROR:")
            print(repr(e))

            logger.exception(
                "Unhandled MQTT message error"
            )

    # ========================================================
    # DISCONNECT CALLBACK
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
            "MQTT subscriber disconnected: %s",
            reason_code
        )

    # ========================================================
    # START
    # ========================================================

    def start(self):

        print("MQTT SUBSCRIBER STARTING...")

        if self.started:

            print(
                "MQTT SUBSCRIBER ALREADY STARTED"
            )

            return

        print(
            "BROKER:",
            self.MQTT_BROKER_HOST
        )

        print(
            "PORT:",
            self.MQTT_BROKER_PORT
        )

        print(
            "USERNAME:",
            self.MQTT_USERNAME
        )

        self.client.connect(
            self.MQTT_BROKER_HOST,
            self.MQTT_BROKER_PORT,
            keepalive=60
        )

        print(
            "MQTT CONNECT() CALLED"
        )

        self.client.loop_start()

        print(
            "MQTT LOOP STARTED"
        )

        self.started = True
    # ========================================================
    # STOP
    # ========================================================

    def stop(self):

        if not self.started:
            return

        logger.info(
            "Stopping MQTT subscriber..."
        )

        self.client.loop_stop()

        self.client.disconnect()

        self.started = False
        self.connected = False

        logger.info(
            "MQTT subscriber stopped"
        )