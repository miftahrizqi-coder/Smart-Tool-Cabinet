from app.services.transaction_service import TransactionService
import pytest

from app.core.exceptions import NotFoundException

from app.core.exceptions import ConflictException

service = TransactionService()


def test_add_transaction_item():

    transaction = service.create_transaction(
        employee_id="TEST-EMP-002",
        cabinet_id="TEST-CAB-001"
    )

    item = service.add_transaction_item(
        transaction_id=transaction["transactionId"],
        tool_id="TEST-TOOL-001",
        slot_number=1
    )

    assert item["toolId"] == "TEST-TOOL-001"
    assert item["slotNumber"] == 1
    assert item["status"] == "borrowed"