from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class EventCreate(BaseModel):
    eventId: str = Field(..., min_length=1)
    eventType: str = Field(..., min_length=1)
    channel: str = Field(..., min_length=1)
    cabinetId: str = Field(..., min_length=1)

    timestamp: datetime

    status: str = Field(..., min_length=1)

    result: dict[str, Any] = Field(
        default_factory=dict
    )


class EventResponse(EventCreate):
    model_config = ConfigDict(
        extra="allow"
    )