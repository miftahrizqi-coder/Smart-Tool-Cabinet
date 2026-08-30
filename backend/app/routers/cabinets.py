from fastapi import APIRouter, HTTPException, status

from app.schemas.cabinet import (
    CabinetCreate,
    CabinetResponse,
    CabinetStatusUpdate,
    CabinetUpdate
)

from app.services.cabinet_service import (
    CabinetService
)


router = APIRouter(
    prefix="/api/v1/cabinets",
    tags=["Cabinets"]
)

cabinet_service = CabinetService()


@router.get(
    "/",
    response_model=list[CabinetResponse]
)
def get_cabinets():

    return cabinet_service.get_all_cabinets()


@router.get(
    "/{cabinet_id}",
    response_model=CabinetResponse
)
def get_cabinet(cabinet_id: str):

    cabinet = (
        cabinet_service.get_cabinet(
            cabinet_id
        )
    )

    if not cabinet:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cabinet tidak ditemukan"
        )

    return cabinet


@router.get(
    "/{cabinet_id}/tools"
)
def get_cabinet_tools(cabinet_id: str):

    cabinet = (
        cabinet_service.get_cabinet(
            cabinet_id
        )
    )

    if not cabinet:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cabinet tidak ditemukan"
        )

    return cabinet_service.get_tools(
        cabinet_id
    )


@router.post(
    "/",
    response_model=CabinetResponse,
    status_code=status.HTTP_201_CREATED
)
def create_cabinet(
    data: CabinetCreate
):

    try:

        return cabinet_service.create_cabinet(
            data
        )

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.patch(
    "/{cabinet_id}",
    response_model=CabinetResponse
)
def update_cabinet(
    cabinet_id: str,
    data: CabinetUpdate
):

    try:

        cabinet = (
            cabinet_service.update_cabinet(
                cabinet_id,
                data
            )
        )

        if not cabinet:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cabinet tidak ditemukan"
            )

        return cabinet

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.patch(
    "/{cabinet_id}/status",
    response_model=CabinetResponse
)
def update_cabinet_status(
    cabinet_id: str,
    data: CabinetStatusUpdate
):

    cabinet = (
        cabinet_service.update_status(
            cabinet_id,
            data.status
        )
    )

    if not cabinet:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cabinet tidak ditemukan"
        )

    return cabinet