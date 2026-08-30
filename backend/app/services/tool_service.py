from uuid import uuid4

from app.repositories.tool_repository import ToolRepository
from app.schemas.tool import ToolCreate, ToolUpdate
from app.repositories.cabinet_repository import (
    CabinetRepository
)


class ToolService:

    def __init__(self):
        self.repository = ToolRepository()
        self.cabinet_repository = CabinetRepository()

    def get_all_tools(self):
        return self.repository.get_all()

    def get_tool(self, tool_id: str):
        return self.repository.get_by_id(tool_id)

    def create_tool(self, data: ToolCreate):

        existing_tool = self.repository.find_by_slot(
            data.cabinetId,
            data.slotNumber
        )

        if existing_tool:
            raise ValueError(
                "Slot tersebut sudah digunakan oleh alat lain"
            )

        tool_id = f"TOOL-{uuid4().hex[:8].upper()}"

        tool_data = {
            "toolId": tool_id,
            "assetNumber": data.assetNumber,
            "name": data.name,
            "category": data.category,
            "cabinetId": data.cabinetId,
            "slotNumber": data.slotNumber,

            "status": "available",

            "usageCount": 0,
            "totalUsageDuration": 0,

            "maintenanceThreshold": (
                data.maintenanceThreshold
            ),

            "maintenanceWarningThreshold": (
                data.maintenanceWarningThreshold
            ),

            "maintenanceStatus": "normal"
        }

        return self.repository.create(
            tool_id,
            tool_data
        )

    def update_tool(
        self,
        tool_id: str,
        data: ToolUpdate
    ):

        existing_tool = self.repository.get_by_id(
            tool_id
        )

        if not existing_tool:
            return None

        update_data = data.model_dump(
            exclude_unset=True
        )

        if (
            "cabinetId" in update_data
            or "slotNumber" in update_data
        ):
            cabinet_id = update_data.get(
                "cabinetId",
                existing_tool["cabinetId"]
            )

            slot_number = update_data.get(
                "slotNumber",
                existing_tool["slotNumber"]
            )

            slot_tool = self.repository.find_by_slot(
                cabinet_id,
                slot_number
            )

            if (
                slot_tool
                and slot_tool["id"] != tool_id
            ):
                raise ValueError(
                    "Slot tersebut sudah digunakan"
                )

        if not update_data:
            return existing_tool

        return self.repository.update(
            tool_id,
            update_data
        )

    def update_status(
        self,
        tool_id: str,
        status: str
    ):

        existing_tool = self.repository.get_by_id(
            tool_id
        )

        if not existing_tool:
            return None

        return self.repository.update(
            tool_id,
            {
                "status": status
            }
        )

    def validate_slot(
        self,
        cabinet_id: str,
        slot_number: int,
        exclude_tool_id: str | None = None
    ):

        cabinet = (
            self.cabinet_repository.get_by_id(
                cabinet_id
            )
        )

        if not cabinet:

            raise ValueError(
                "Cabinet tidak ditemukan"
            )

        if cabinet.get("status") != "active":

            raise ValueError(
                "Cabinet tidak aktif"
            )

        slot_count = cabinet.get(
            "slotCount",
            0
        )

        if slot_number < 1:

            raise ValueError(
                "slotNumber harus dimulai dari 1"
            )

        if slot_number > slot_count:

            raise ValueError(
                f"slotNumber {slot_number} "
                f"melebihi kapasitas cabinet "
                f"({slot_count} slot)"
            )

        existing_tool = (
            self.repository
            .get_by_cabinet_and_slot(
                cabinet_id,
                slot_number
            )
        )

        if (
            existing_tool
            and existing_tool["id"] != exclude_tool_id
        ):

            raise ValueError(
                f"Slot {slot_number} pada cabinet "
                f"{cabinet_id} sudah digunakan"
            )

        return True