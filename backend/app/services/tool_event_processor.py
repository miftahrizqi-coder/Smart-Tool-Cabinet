from typing import Any

from app.repositories.tool_repository import ToolRepository
from app.services.idempotency_service import idempotency_service
from app.services.transaction_context_service import (
    transaction_context_service
)
from app.services.transaction_service import TransactionService


class ToolEventProcessor:

    def __init__(
        self,
        tool_repository: ToolRepository | None = None,
        transaction_service: TransactionService | None = None
    ):
        self.tool_repository = (
            tool_repository
            if tool_repository is not None
            else ToolRepository()
        )

        self.transaction_service = (
            transaction_service
            if transaction_service is not None
            else TransactionService()
        )

    # ========================================================
    # PROCESS TOOL EVENT
    # ========================================================

    def process(self, event) -> dict[str, Any]:

        if not idempotency_service.check_and_mark(
            event.eventId
        ):
            return {
                "status": "ignored",
                "reason": "duplicate_event",
                "eventId": event.eventId
            }

        # ----------------------------------------------------
        # 1. Ambil informasi event
        # ----------------------------------------------------

        event_id = event.eventId
        cabinet_id = event.cabinetId

        slot_number = event.data.slotNumber
        current_state = event.data.state

        # ----------------------------------------------------
        # 2. Validasi physical state
        # ----------------------------------------------------

        if current_state not in ["OCCUPIED", "EMPTY"]:

            return {
                "status": "rejected",
                "reason": "invalid_tool_state",
                "eventId": event_id
            }

        # ----------------------------------------------------
        # 3. Ambil Transaction Context
        # ----------------------------------------------------

        context = transaction_context_service.get_context(
            cabinet_id
        )

        if context is None:

            return {
                "status": "rejected",
                "reason": "no_active_transaction_context",
                "eventId": event_id
            }

        employee_id = context["employeeId"]

        # ----------------------------------------------------
        # 4. Cari tool berdasarkan cabinet + slot
        # ----------------------------------------------------

        tool = self.tool_repository.get_by_slot(
            cabinet_id=cabinet_id,
            slot_number=slot_number
        )

        if tool is None:

            return {
                "status": "rejected",
                "reason": "tool_not_found",
                "eventId": event_id,
                "cabinetId": cabinet_id,
                "slotNumber": slot_number
            }

        tool_id = tool["id"]

        # ----------------------------------------------------
        # 5. Ambil physical state sebelumnya
        # ----------------------------------------------------

        tools_context = context.setdefault(
            "tools",
            {}
        )

        slot_key = str(slot_number)

        tool_context = tools_context.get(
            slot_key
        )

        # ----------------------------------------------------
        # 6. Initial state inference
        # ----------------------------------------------------

        if tool_context is None:

            tool_status = tool.get(
                "status"
            )

            if tool_status == "available":

                previous_state = "OCCUPIED"

            elif tool_status == "borrowed":

                previous_state = "EMPTY"

            else:

                return {
                    "status": "rejected",
                    "reason": "invalid_tool_status",
                    "eventId": event_id,
                    "toolId": tool_id,
                    "toolStatus": tool_status
                }

        else:

            previous_state = tool_context.get(
                "state"
            )

        # ----------------------------------------------------
        # 7. Validasi previous state
        # ----------------------------------------------------

        if previous_state not in [
            "OCCUPIED",
            "EMPTY"
        ]:

            return {
                "status": "rejected",
                "reason": "invalid_previous_state",
                "eventId": event_id,
                "toolId": tool_id
            }

        # ----------------------------------------------------
        # 8. Tidak ada perubahan state
        # ----------------------------------------------------

        if previous_state == current_state:

            return {
                "status": "ignored",
                "reason": "no_state_change",
                "eventId": event_id,
                "toolId": tool_id,
                "slotNumber": slot_number,
                "state": current_state
            }

        # ----------------------------------------------------
        # 9. Tentukan operation
        # ----------------------------------------------------

        if (
            previous_state == "OCCUPIED"
            and current_state == "EMPTY"
        ):

            operation = "BORROW"

        elif (
            previous_state == "EMPTY"
            and current_state == "OCCUPIED"
        ):

            operation = "RETURN"

        else:

            return {
                "status": "rejected",
                "reason": "invalid_state_transition",
                "eventId": event_id,
                "toolId": tool_id,
                "previousState": previous_state,
                "currentState": current_state
            }

        # ----------------------------------------------------
        # 10. Simpan physical state terbaru ke context
        # ----------------------------------------------------

        tools_context[slot_key] = {
            "toolId": tool_id,
            "slotNumber": slot_number,
            "state": current_state
        }

        # ----------------------------------------------------
        # 11. Kirim ke Transaction Service
        # ----------------------------------------------------

        transaction_result = (
            self.transaction_service.process_tool_event(
                employee_id=employee_id,
                cabinet_id=cabinet_id,
                tool_id=tool_id,
                slot_number=slot_number,
                operation=operation
            )
        )
        # ----------------------------------------------------
        # 12. Return result
        # ----------------------------------------------------

        return {
            "status": "accepted",
            "operation": operation,
            "eventId": event_id,
            "employeeId": employee_id,
            "cabinetId": cabinet_id,
            "toolId": tool_id,
            "slotNumber": slot_number,
            "previousState": previous_state,
            "currentState": current_state,
            "transaction": transaction_result
        }