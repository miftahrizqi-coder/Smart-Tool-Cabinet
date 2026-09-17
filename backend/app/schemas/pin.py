from pydantic import BaseModel, Field


class PINData(BaseModel):

    pin: str = Field(
        ...,
        min_length=4,
        max_length=8
    )


class PINEvent(BaseModel):

    eventId: str = Field(
        ...,
        min_length=1
    )

    eventType: str = Field(
        ...,
        pattern=r"^auth\.pin_entered$"
    )

    timestamp: str

    deviceId: str = Field(
        ...,
        min_length=1
    )

    cabinetId: str = Field(
        ...,
        min_length=1
    )

    data: PINData