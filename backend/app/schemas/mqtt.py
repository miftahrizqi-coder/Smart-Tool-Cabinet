from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, ConfigDict


class MQTTEventBase(BaseModel):

    model_config = ConfigDict(
        extra="forbid"
    )

    eventId: str = Field(
        ...,
        min_length=1
    )

    eventType: str = Field(
        ...,
        min_length=1
    )

    timestamp: datetime

    deviceId: str = Field(
        ...,
        min_length=1
    )

    cabinetId: str = Field(
        ...,
        min_length=1
    )

    data: dict[str, Any]