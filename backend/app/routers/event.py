from fastapi import APIRouter, HTTPException, Query

from app.schemas.event import EventResponse
from app.services.event_service import EventService


router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

event_service = EventService()


@router.get(
    "/",
    response_model=list[EventResponse]
)
def get_events(
    limit: int = Query(
        default=50,
        ge=1,
        le=100
    )
):
    return event_service.get_events(
        limit=limit
    )


@router.get(
    "/{event_id}",
    response_model=EventResponse
)
def get_event(
    event_id: str
):
    event = event_service.get_event(
        event_id
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return event