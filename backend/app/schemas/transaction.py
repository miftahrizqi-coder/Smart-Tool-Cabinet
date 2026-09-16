from pydantic import BaseModel, Field
from datetime import datetime

class TransactionCreate(BaseModel):

    employeeId: str = Field(
        min_length=1
    )

    cabinetId: str = Field(
        min_length=1
    )

class TransactionResponse(BaseModel):

    transactionId: str

    employeeId: str

    cabinetId: str

    status: str

    startedAt: datetime

    completedAt: datetime | None = None

    createdAt: datetime

    updatedAt: datetime

class TransactionItemResponse(BaseModel):

    transactionItemId: str

    toolId: str
    toolName: str
    assetNumber: str

    cabinetId: str

    slotNumber: int

    status: str

    takenAt: datetime

    returnedAt: datetime | None = None

    createdAt: datetime

    updatedAt: datetime

class TransactionItemCreate(BaseModel):
    toolId: str = Field(
        ...,
        min_length=1,
        description="ID tool yang digunakan"
    )

    slotNumber: int = Field(
        ...,
        ge=1,
        description="Nomor slot tempat tool berada"
    )

class TransactionDetailResponse(BaseModel):

    transactionId: str

    employeeId: str

    cabinetId: str

    status: str

    startedAt: datetime | None = None

    completedAt: datetime | None = None

    createdAt: datetime | None = None

    updatedAt: datetime | None = None

    items: list[TransactionItemResponse] = []