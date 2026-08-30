from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CabinetCreate(BaseModel):

    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    location: Optional[str] = Field(
        default=None,
        max_length=200
    )

    slotCount: int = Field(
        default=6,
        ge=1,
        le=100
    )


class CabinetUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    location: Optional[str] = Field(
        default=None,
        max_length=200
    )

    slotCount: Optional[int] = Field(
        default=None,
        ge=1,
        le=100
    )


class CabinetStatusUpdate(BaseModel):

    status: str = Field(
        ...,
        pattern="^(active|inactive)$"
    )


class CabinetResponse(BaseModel):

    model_config = ConfigDict(
        extra="allow"
    )

    id: str
    cabinetId: str

    name: str
    location: Optional[str] = None

    slotCount: int

    status: str
    doorStatus: str

    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None