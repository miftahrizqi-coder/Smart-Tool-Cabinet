from pydantic import BaseModel, Field
from typing import Literal


class ToolSlotData(BaseModel):

    slotNumber: int = Field(
        ...,
        ge=1
    )

    state: Literal[
        "OCCUPIED",
        "EMPTY"
    ]


class ToolSlotEvent(BaseModel):

    eventId: str = Field(
        ...,
        min_length=1
    )

    eventType: Literal[
        "tool.slot_changed"
    ]

    timestamp: str

    deviceId: str = Field(
        ...,
        min_length=1
    )

    cabinetId: str = Field(
        ...,
        min_length=1
    )

    data: ToolSlotData