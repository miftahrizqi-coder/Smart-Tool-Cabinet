from pydantic import BaseModel, Field


class RFIDData(BaseModel):

    uid: str = Field(
        ...,
        min_length=1,
        description="UID kartu RFID"
    )


class RFIDEvent(BaseModel):

    eventId: str = Field(
        ...,
        min_length=1
    )

    eventType: str = Field(
        ...,
        pattern="^rfid\\.card_tapped$"
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

    data: RFIDData