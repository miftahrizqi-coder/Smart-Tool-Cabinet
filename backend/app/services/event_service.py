from datetime import datetime, timezone
from typing import Any

from app.repositories.event_repository import (
    EventRepository
)


class EventService:

    def __init__(
        self,
        event_repository: EventRepository | None = None
    ):
        self.event_repository = (
            event_repository
            if event_repository is not None
            else EventRepository()
        )

    # ========================================================
    # HELPER
    # ========================================================

    @staticmethod
    def _now() -> datetime:
        """
        Menghasilkan timestamp UTC.
        """

        return datetime.now(timezone.utc)

    # ========================================================
    # CREATE EVENT
    # ========================================================

    def create_event(
        self,
        event_id: str,
        event_type: str,
        channel: str,
        cabinet_id: str,
        timestamp: datetime,
        status: str,
        result: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """
        Membuat dan menyimpan event.

        Event menyimpan informasi umum di root
        dan hasil processor di dalam field result.
        """

        if result is None:
            result = {}

        data = {
            "eventId": event_id,
            "eventType": event_type,
            "channel": channel,
            "cabinetId": cabinet_id,
            "timestamp": timestamp,
            "status": status,
            "result": result,
        }

        return self.event_repository.create(
            event_id=event_id,
            data=data
        )

    # ========================================================
    # GET EVENT
    # ========================================================

    def get_event(
        self,
        event_id: str
    ) -> dict[str, Any] | None:
        """
        Mengambil event berdasarkan ID.
        """

        return self.event_repository.get_by_id(
            event_id
        )

    # ========================================================
    # GET EVENTS
    # ========================================================

    def get_events(
        self,
        limit: int = 50
    ) -> list[dict[str, Any]]:
        """
        Mengambil event terbaru.
        """

        return self.event_repository.get_all(
            limit=limit
        )

    # ========================================================
    # CHECK EVENT
    # ========================================================

    def event_exists(
        self,
        event_id: str
    ) -> bool:
        """
        Mengecek apakah event sudah tersimpan.
        """

        return self.event_repository.exists(
            event_id
        )