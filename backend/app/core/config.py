from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ==========================================
    # FIREBASE
    # ==========================================

    FIREBASE_CREDENTIALS_PATH: str = "serviceAccountKey.json"

    # ==========================================
    # MQTT
    # ==========================================

    mqtt_host: str
    mqtt_port: int = 8883

    mqtt_username: str
    mqtt_password: str

    mqtt_use_tls: bool = True

    mqtt_client_id: str = "STC-BACKEND-001"

    # ==========================================
    # MQTT TOPICS
    # ==========================================

    mqtt_events_topic: str = "stc/+/events"

    mqtt_commands_topic: str = "stc/{cabinet_id}/commands"

    mqtt_status_topic: str = "stc/+/status"

    # ==========================================
    # ENV FILE
    # ==========================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()