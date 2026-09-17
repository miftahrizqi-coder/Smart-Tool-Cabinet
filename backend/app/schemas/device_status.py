from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


class DeviceStatusData(BaseModel):

    model_config = ConfigDict(
        extra="forbid"
    )

    status: Literal[
        "ONLINE",
        "OFFLINE",
        "ERROR",
        "MAINTENANCE"
    ]


class DeviceStatusEvent(BaseModel):

    model_config = ConfigDict(
        extra="forbid"
    )

    eventId: str = Field(
        ...,
        min_length=1
    )

    eventType: Literal[
        "device.status_changed"
    ]

    timestamp: datetime

    deviceId: str = Field(
        ...,
        min_length=1
    )

    cabinetId: str = Field(
        ...,
        min_length=1
    )

    data: DeviceStatusData