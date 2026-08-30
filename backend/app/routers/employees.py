from fastapi import APIRouter, HTTPException, status

from app.schemas.employee import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeStatusUpdate,
    EmployeeUpdate,
    EmployeeVerifyRequest,
    EmployeeVerifyResponse
)

from app.services.employee_service import (
    EmployeeService
)


router = APIRouter(
    prefix="/api/v1/employees",
    tags=["Employees"]
)

employee_service = EmployeeService()


@router.get(
    "/",
    response_model=list[EmployeeResponse]
)
def get_employees():

    return employee_service.get_all_employees()


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(employee_id: str):

    employee = (
        employee_service.get_employee(
            employee_id
        )
    )

    if not employee:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee tidak ditemukan"
        )

    return employee


@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED
)
def create_employee(
    data: EmployeeCreate
):

    try:

        return employee_service.create_employee(
            data
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.patch(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(
    employee_id: str,
    data: EmployeeUpdate
):

    try:

        employee = (
            employee_service.update_employee(
                employee_id,
                data
            )
        )

        if not employee:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee tidak ditemukan"
            )

        return employee

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.patch(
    "/{employee_id}/status",
    response_model=EmployeeResponse
)
def update_employee_status(
    employee_id: str,
    data: EmployeeStatusUpdate
):

    employee = (
        employee_service.update_status(
            employee_id,
            data.status
        )
    )

    if not employee:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee tidak ditemukan"
        )

    return employee


@router.post(
    "/verify",
    response_model=EmployeeVerifyResponse
)
def verify_employee(
    data: EmployeeVerifyRequest
):

    employee = (
        employee_service.verify_identity(
            data.rfidUid,
            data.pin
        )
    )

    if not employee:

        return {
            "authenticated": False,
            "employee": None
        }

    return {
        "authenticated": True,
        "employee": employee
    }