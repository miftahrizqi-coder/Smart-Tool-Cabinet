from fastapi import APIRouter, HTTPException, status

from app.schemas.tool import (
    ToolCreate,
    ToolResponse,
    ToolStatusUpdate,
    ToolUpdate
)

from app.services.tool_service import ToolService


router = APIRouter(
    prefix="/api/v1/tools",
    tags=["Tools"]
)

tool_service = ToolService()


@router.get(
    "/",
    response_model=list[ToolResponse]
)
def get_tools():

    return tool_service.get_all_tools()


@router.get(
    "/{tool_id}",
    response_model=ToolResponse
)
def get_tool(tool_id: str):

    tool = tool_service.get_tool(tool_id)

    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool tidak ditemukan"
        )

    return tool


@router.post(
    "/",
    response_model=ToolResponse,
    status_code=status.HTTP_201_CREATED
)
def create_tool(data: ToolCreate):

    try:
        return tool_service.create_tool(data)

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.patch(
    "/{tool_id}",
    response_model=ToolResponse
)
def update_tool(
    tool_id: str,
    data: ToolUpdate
):

    try:

        tool = tool_service.update_tool(
            tool_id,
            data
        )

        if not tool:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tool tidak ditemukan"
            )

        return tool

    except ValueError as error:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )


@router.patch(
    "/{tool_id}/status",
    response_model=ToolResponse
)
def update_tool_status(
    tool_id: str,
    data: ToolStatusUpdate
):

    tool = tool_service.update_status(
        tool_id,
        data.status
    )

    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool tidak ditemukan"
        )

    return tool