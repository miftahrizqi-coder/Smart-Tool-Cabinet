from app.services.transaction_context_service import (
    transaction_context_service
)


class BorrowReturnService:

    @staticmethod
    def determine_operation(
        cabinet_id: str,
        previous_slot_status: str,
        current_slot_status: str,
        tool_id: str
    ):

        context = (
            transaction_context_service
            .get_context(cabinet_id)
        )

        if context is None:

            return {
                "status": "rejected",
                "reason": "no_active_transaction_context"
            }

        if (
            previous_slot_status == "OCCUPIED"
            and current_slot_status == "EMPTY"
        ):

            operation = "BORROW"

        elif (
            previous_slot_status == "EMPTY"
            and current_slot_status == "OCCUPIED"
        ):

            operation = "RETURN"

        else:

            return {
                "status": "ignored",
                "reason": "no_state_change"
            }

        transaction_context_service.add_tool_event(
            cabinet_id=cabinet_id,
            tool_id=tool_id,
            operation=operation
        )

        return {
            "status": "accepted",
            "operation": operation,
            "employeeId": context["employeeId"],
            "cabinetId": cabinet_id,
            "toolId": tool_id
        }