from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class EmployeeCreate(BaseModel):

    employeeNumber: str = Field(
        ...,
        min_length=1,
        max_length=50
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    department: Optional[str] = Field(
        default=None,
        max_length=100
    )

    position: Optional[str] = Field(
        default=None,
        max_length=100
    )

    rfidUid: str = Field(
        ...,
        min_length=4,
        max_length=32
    )

    pin: str = Field(
        ...,
        min_length=4,
        max_length=12
    )


class EmployeeUpdate(BaseModel):

    employeeNumber: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=50
    )

    name: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    department: Optional[str] = Field(
        default=None,
        max_length=100
    )

    position: Optional[str] = Field(
        default=None,
        max_length=100
    )

    rfidUid: Optional[str] = Field(
        default=None,
        min_length=4,
        max_length=32
    )

    pin: Optional[str] = Field(
        default=None,
        min_length=4,
        max_length=12
    )


class EmployeeStatusUpdate(BaseModel):

    status: str = Field(
        ...,
        pattern="^(active|inactive)$"
    )


class EmployeeResponse(BaseModel):

    model_config = ConfigDict(
        extra="allow"
    )

    id: str
    employeeId: str
    employeeNumber: str
    name: str

    department: Optional[str] = None
    position: Optional[str] = None

    rfidUid: str

    status: str

    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


class EmployeeVerifyRequest(BaseModel):

    rfidUid: str = Field(
        ...,
        min_length=4,
        max_length=32
    )

    pin: str = Field(
        ...,
        min_length=4,
        max_length=12
    )


class EmployeeVerifyResponse(BaseModel):

    authenticated: bool
    employee: Optional[EmployeeResponse] = None