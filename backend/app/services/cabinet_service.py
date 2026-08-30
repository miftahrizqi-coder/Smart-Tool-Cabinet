from datetime import datetime, timezone
from uuid import uuid4

from app.repositories.cabinet_repository import (
    CabinetRepository
)

from app.repositories.tool_repository import (
    ToolRepository
)

from app.schemas.cabinet import (
    CabinetCreate,
    CabinetUpdate
)


class CabinetService:

    def __init__(self):

        self.repository = CabinetRepository()
        self.tool_repository = ToolRepository()

    def get_all_cabinets(self):

        return self.repository.get_all()

    def get_cabinet(self, cabinet_id: str):

        return self.repository.get_by_id(
            cabinet_id
        )

    def create_cabinet(
        self,
        data: CabinetCreate
    ):

        existing = (
            self.repository.get_by_name(
                data.name
            )
        )

        if existing:

            raise ValueError(
                "Nama cabinet sudah digunakan"
            )

        cabinet_id = (
            f"CAB-{uuid4().hex[:8].upper()}"
        )

        now = datetime.now(timezone.utc)

        cabinet_data = {

            "cabinetId": cabinet_id,

            "name": data.name,

            "location": data.location,

            "slotCount": data.slotCount,

            "status": "active",

            "doorStatus": "closed",

            "createdAt": now,

            "updatedAt": now
        }

        return self.repository.create(
            cabinet_id,
            cabinet_data
        )

    def update_cabinet(
        self,
        cabinet_id: str,
        data: CabinetUpdate
    ):

        existing = (
            self.repository.get_by_id(
                cabinet_id
            )
        )

        if not existing:
            return None

        update_data = data.model_dump(
            exclude_unset=True
        )

        if not update_data:
            return existing

        if "name" in update_data:

            existing_name = (
                self.repository.get_by_name(
                    update_data["name"]
                )
            )

            if (
                existing_name
                and existing_name["id"] != cabinet_id
            ):

                raise ValueError(
                    "Nama cabinet sudah digunakan"
                )

        if "slotCount" in update_data:

            current_slot_count = (
                existing["slotCount"]
            )

            new_slot_count = (
                update_data["slotCount"]
            )

            if new_slot_count < current_slot_count:

                tools = self.get_tools(
                    cabinet_id
                )

                occupied_slots = [
                    tool["slotNumber"]
                    for tool in tools
                ]

                invalid_slots = [
                    slot
                    for slot in occupied_slots
                    if slot > new_slot_count
                ]

                if invalid_slots:

                    raise ValueError(
                        "Tidak dapat mengurangi "
                        "slot karena masih terdapat "
                        "alat pada slot tersebut"
                    )

        update_data["updatedAt"] = (
            datetime.now(timezone.utc)
        )

        return self.repository.update(
            cabinet_id,
            update_data
        )

    def update_status(
        self,
        cabinet_id: str,
        status: str
    ):

        existing = (
            self.repository.get_by_id(
                cabinet_id
            )
        )

        if not existing:
            return None

        return self.repository.update(
            cabinet_id,
            {
                "status": status,
                "updatedAt":
                    datetime.now(timezone.utc)
            }
        )

    def get_tools(
        self,
        cabinet_id: str
    ):

        tools = self.tool_repository.get_all()

        return [
            tool
            for tool in tools
            if tool.get("cabinetId") == cabinet_id
        ]