from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ToolCreate(BaseModel):
    assetNumber: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    category: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    cabinetId: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    slotNumber: int = Field(
        ...,
        ge=1
    )

    maintenanceThreshold: int = Field(
        default=200,
        ge=1
    )

    maintenanceWarningThreshold: int = Field(
        default=180,
        ge=1
    )


class ToolUpdate(BaseModel):
    assetNumber: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    category: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    cabinetId: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    slotNumber: Optional[int] = Field(
        default=None,
        ge=1
    )

    maintenanceThreshold: Optional[int] = Field(
        default=None,
        ge=1
    )

    maintenanceWarningThreshold: Optional[int] = Field(
        default=None,
        ge=1
    )


class ToolStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        min_length=1
    )


class ToolResponse(BaseModel):
    model_config = ConfigDict(
        extra="allow"
    )

    id: str
    toolId: str
    assetNumber: str
    name: str
    category: str
    
    cabinetId: str
    slotNumber: int

    status: str

    usageCount: int = 0
    totalUsageDuration: int = 0

    maintenanceThreshold: int = 200
    maintenanceWarningThreshold: int = 180
    maintenanceStatus: str = "normal"