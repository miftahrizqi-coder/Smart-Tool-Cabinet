from app.services.transaction_context_service import transaction_context_service
from app.services.borrow_return_service import BorrowReturnService

def test_tool_event_without_authentication():

    transaction_context_service.remove_context(
        "CAB-001"
    )

    result = (
        BorrowReturnService
        .determine_operation(
            cabinet_id="CAB-001",
            previous_slot_status="OCCUPIED",
            current_slot_status="EMPTY",
            tool_id="TOOL-001"
        )
    )

    assert result["status"] == "rejected"

    assert (
        result["reason"]
        == "no_active_transaction_context"
    )