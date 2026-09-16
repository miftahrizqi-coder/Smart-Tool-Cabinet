from datetime import datetime, timezone
from uuid import uuid4
from typing import Any

from app.repositories.transaction_repository import (
    TransactionRepository
)

from app.repositories.employee_repository import (
    EmployeeRepository
)

from app.repositories.cabinet_repository import (
    CabinetRepository
)

from app.repositories.tool_repository import (
    ToolRepository
)

from app.core.exceptions import (
    NotFoundException,
    ConflictException,
    ValidationException
)


class TransactionService:

    def __init__(self):

        self.transaction_repository = (
            TransactionRepository()
        )

        self.employee_repository = (
            EmployeeRepository()
        )

        self.cabinet_repository = (
            CabinetRepository()
        )

        self.tool_repository = (
            ToolRepository()
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

    @staticmethod
    def _generate_transaction_id() -> str:
        """
        Generate transaction ID.
        """

        return f"TRX-{uuid4().hex[:8].upper()}"

    # ========================================================

    @staticmethod
    def _generate_item_id() -> str:
        """
        Generate transaction item ID.
        """

        return f"ITEM-{uuid4().hex[:8].upper()}"

    # ========================================================
    # CREATE TRANSACTION
    # ========================================================

    def create_transaction(
        self,
        employee_id: str,
        cabinet_id: str
    ) -> dict[str, Any]:
        """
        Membuat transaction baru.

        Business rules:
        1. Employee harus ada.
        2. Cabinet harus ada.
        3. Cabinet harus aktif.
        4. Employee tidak boleh memiliki
           transaction aktif.
        """

        # ----------------------------------------------------
        # 1. Validate Employee
        # ----------------------------------------------------

        employee = (
            self.employee_repository.get_by_id(
                employee_id
            )
        )

        if employee is None:

            raise NotFoundException(
                f"Employee '{employee_id}' not found"
            )

        # ----------------------------------------------------
        # 2. Validate Cabinet
        # ----------------------------------------------------

        cabinet = (
            self.cabinet_repository.get_by_id(
                cabinet_id
            )
        )

        if cabinet is None:

            raise NotFoundException(
                f"Cabinet '{cabinet_id}' not found"
            )

        # ----------------------------------------------------
        # 3. Validate Cabinet Status
        # ----------------------------------------------------

        cabinet_status = cabinet.get(
            "status"
        )

        if cabinet_status != "active":

            raise ConflictException(
                f"Cabinet '{cabinet_id}' is not active"
            )

        # ----------------------------------------------------
        # 4. Check Active Transaction
        # ----------------------------------------------------

        active_transaction = (
            self.transaction_repository
            .get_active_by_employee(
                employee_id
            )
        )

        if active_transaction is not None:

            active_id = active_transaction.get(
                "transactionId"
            )

            raise ConflictException(
                "Employee already has an active "
                f"transaction '{active_id}'"
            )

        # ----------------------------------------------------
        # 5. Generate ID
        # ----------------------------------------------------

        transaction_id = (
            self._generate_transaction_id()
        )

        now = self._now()

        # ----------------------------------------------------
        # 6. Prepare Data
        # ----------------------------------------------------

        data = {

            "employeeId": employee_id,

            "cabinetId": cabinet_id,

            "status": "open",

            "startedAt": now,

            "completedAt": None,

            "createdAt": now,

            "updatedAt": now
        }

        # ----------------------------------------------------
        # 7. Save
        # ----------------------------------------------------

        return (
            self.transaction_repository.create(
                transaction_id,
                data
            )
        )

    # ========================================================
    # GET TRANSACTION
    # ========================================================
    def get_transaction(
        self,
        transaction_id: str
    ) -> dict[str, Any]:

        transaction = (
            self.transaction_repository.get_by_id(
                transaction_id
            )
        )

        if transaction is None:

            raise NotFoundException(
                f"Transaction '{transaction_id}' not found"
            )

        return transaction

    # ========================================================
    # GET ALL TRANSACTIONS
    # ========================================================

    def get_all_transactions(
        self,
        limit: int = 50
    ) -> list[dict[str, Any]]:
        """
        Mengambil daftar seluruh transaction.
        """

        return (
            self.transaction_repository
            .get_all(limit=limit)
        )
    # ========================================================
    # GET ACTIVE TRANSACTION
    # ========================================================

    def get_active_transaction(
        self,
        employee_id: str
    ) -> dict[str, Any] | None:

        # Validate employee first

        employee = (
            self.employee_repository.get_by_id(
                employee_id
            )
        )

        if employee is None:

            raise NotFoundException(
                f"Employee '{employee_id}' not found"
            )

        return (
            self.transaction_repository
            .get_active_by_employee(
                employee_id
            )
        )

    # ========================================================
    # GET TRANSACTION ITEMS
    # ========================================================

    def get_transaction_items(
        self,
        transaction_id: str
    ) -> list[dict[str, Any]]:

        transaction = (
            self.transaction_repository.get_by_id(
                transaction_id
            )
        )

        if transaction is None:

            raise NotFoundException(
                f"Transaction '{transaction_id}' not found"
            )

        items = (
            self.transaction_repository.get_items(
                transaction_id
            )
        )

        return [
            self._enrich_transaction_item(item)
            for item in items
        ]

    # ========================================================
    # ADD TRANSACTION ITEM
    # ========================================================

    def add_transaction_item(
        self,
        transaction_id: str,
        tool_id: str,
        slot_number: int
    ) -> dict[str, Any]:
        """
        Menambahkan tool ke transaction.

        Status awal:
            borrowed
        """

        # ----------------------------------------------------
        # 1. Validate Transaction
        # ----------------------------------------------------

        transaction = (
            self.transaction_repository.get_by_id(
                transaction_id
            )
        )

        if transaction is None:

            raise NotFoundException(
                f"Transaction '{transaction_id}' not found"
            )

        # ----------------------------------------------------
        # 2. Transaction must be OPEN
        # ----------------------------------------------------

        if transaction.get("status") != "open":

            raise ConflictException(
                f"Transaction '{transaction_id}' "
                "is not open"
            )

        # ----------------------------------------------------
        # 3. Validate Tool
        # ----------------------------------------------------

        tool = (
            self.tool_repository.get_by_id(
                tool_id
            )
        )

        if tool is None:

            raise NotFoundException(
                f"Tool '{tool_id}' not found"
            )

        # ----------------------------------------------------
        # 4. Validate Cabinet
        # ----------------------------------------------------

        cabinet_id = transaction.get(
            "cabinetId"
        )

        cabinet = (
            self.cabinet_repository.get_by_id(
                cabinet_id
            )
        )

        if cabinet is None:

            raise NotFoundException(
                f"Cabinet '{cabinet_id}' not found"
            )

        # ----------------------------------------------------
        # 5. Validate Slot Number
        # ----------------------------------------------------

        slot_count = cabinet.get(
            "slotCount"
        )

        if slot_count is None:

            raise ValidationException(
                f"Cabinet '{cabinet_id}' "
                "does not have slotCount"
            )

        if slot_number < 1 or slot_number > slot_count:

            raise ValidationException(
                f"slotNumber must be between 1 "
                f"and {slot_count}"
            )

        # ----------------------------------------------------
        # 6. Validate Tool Cabinet
        # ----------------------------------------------------

        tool_cabinet_id = tool.get(
            "cabinetId"
        )

        if tool_cabinet_id != cabinet_id:

            raise ConflictException(
                f"Tool '{tool_id}' does not belong "
                f"to cabinet '{cabinet_id}'"
            )

        # ----------------------------------------------------
        # 7. Validate Tool Slot
        # ----------------------------------------------------

        tool_slot_number = tool.get(
            "slotNumber"
        )

        if tool_slot_number != slot_number:

            raise ConflictException(
                f"Tool '{tool_id}' is not assigned "
                f"to slot {slot_number}"
            )

        # ----------------------------------------------------
        # 8. Validate Tool Availability
        # ----------------------------------------------------

        tool_status = tool.get(
            "status"
        )

        if tool_status != "available":

            raise ConflictException(
                f"Tool '{tool_id}' is not available"
            )

        # ----------------------------------------------------
        # 9. Check Duplicate Item
        # ----------------------------------------------------

        existing_items = (
            self.transaction_repository
            .get_items(transaction_id)
        )

        for item in existing_items:

            if item.get("toolId") == tool_id:

                raise ConflictException(
                    f"Tool '{tool_id}' is already "
                    "added to this transaction"
                )

        # ----------------------------------------------------
        # 10. Generate Item ID
        # ----------------------------------------------------

        item_id = self._generate_item_id()

        now = self._now()

        # ----------------------------------------------------
        # 11. Prepare Item
        # ----------------------------------------------------

        data = {

            "toolId": tool_id,

            "cabinetId": cabinet_id,

            "slotNumber": slot_number,

            "status": "borrowed",

            "takenAt": now,

            "returnedAt": None,

            "createdAt": now,

            "updatedAt": now
        }

        # ----------------------------------------------------
        # 12. Save Item
        # ----------------------------------------------------

        item = (
            self.transaction_repository.add_item(
                transaction_id,
                item_id,
                data
            )
        )

        return self._enrich_transaction_item(item)

    # ========================================================
    # RETURN TRANSACTION ITEM
    # ========================================================

    def return_transaction_item(
        self,
        transaction_id: str,
        item_id: str
    ) -> dict[str, Any]:

        # ----------------------------------------------------
        # 1. Validate Transaction
        # ----------------------------------------------------

        transaction = (
            self.transaction_repository.get_by_id(
                transaction_id
            )
        )

        if transaction is None:

            raise NotFoundException(
                f"Transaction '{transaction_id}' not found"
            )

        # ----------------------------------------------------
        # 2. Transaction must be OPEN
        # ----------------------------------------------------

        if transaction.get("status") != "open":

            raise ConflictException(
                f"Transaction '{transaction_id}' "
                "is already completed"
            )

        # ----------------------------------------------------
        # 3. Get Item
        # ----------------------------------------------------

        item = (
            self.transaction_repository
            .get_item_by_id(
                transaction_id,
                item_id
            )
        )

        if item is None:

            raise NotFoundException(
                f"Transaction item '{item_id}' not found"
            )

        # ----------------------------------------------------
        # 4. Item must be BORROWED
        # ----------------------------------------------------

        if item.get("status") != "borrowed":

            raise ConflictException(
                f"Transaction item '{item_id}' "
                "has already been returned"
            )

        # ----------------------------------------------------
        # 5. Update Item
        # ----------------------------------------------------

        now = self._now()

        updated_item = (
            self.transaction_repository
            .update_item(
                transaction_id,
                item_id,
                {
                    "status": "returned",
                    "returnedAt": now,
                    "updatedAt": now
                }
            )
        )

        # ----------------------------------------------------
        # 6. Check Transaction Completion
        # ----------------------------------------------------

        self._complete_transaction_if_ready(
            transaction_id
        )

        return self._enrich_transaction_item(
            updated_item
        )

    # ========================================================
    # COMPLETE TRANSACTION IF READY
    # ========================================================

    def _complete_transaction_if_ready(
        self,
        transaction_id: str
    ) -> None:

        items = (
            self.transaction_repository
            .get_items(
                transaction_id
            )
        )

        # ----------------------------------------------------
        # No items
        # ----------------------------------------------------

        if not items:

            return

        # ----------------------------------------------------
        # Check all items
        # ----------------------------------------------------

        all_returned = all(
            item.get("status") == "returned"
            for item in items
        )

        if not all_returned:

            return

        # ----------------------------------------------------
        # Complete Transaction
        # ----------------------------------------------------

        now = self._now()

        self.transaction_repository.update(
            transaction_id,
            {
                "status": "completed",
                "completedAt": now,
                "updatedAt": now
            }
        )

    def process_tool_event(
        self,
        employee_id: str,
        cabinet_id: str,
        tool_id: str,
        slot_number: int,
        operation: str
    ):

        # ========================================================
        # BORROW
        # ========================================================

        if operation == "BORROW":

            transaction = self.get_active_transaction(
                employee_id=employee_id
            )

            # Belum memiliki transaction aktif
            if transaction is None:

                transaction = self.create_transaction(
                    employee_id=employee_id,
                    cabinet_id=cabinet_id
                )

            result = self.add_transaction_item(
                transaction_id=transaction["transactionId"],
                tool_id=tool_id,
                slot_number=slot_number
            )

            # ----------------------------------------------------
            # UPDATE TOOL STATUS
            # ----------------------------------------------------

            self.tool_repository.update_status(
                tool_id=tool_id,
                status="borrowed"
            )

            return result

        # ========================================================
        # RETURN
        # ========================================================

        if operation == "RETURN":

            transaction = self.get_active_transaction(
                employee_id=employee_id
            )

            if transaction is None:
                raise ValueError(
                    "No active transaction found"
                )

            transaction_item = (
                self.transaction_repository.get_item_by_tool_id(
                    transaction_id=transaction["transactionId"],
                    tool_id=tool_id
                )
            )

            if transaction_item is None:
                raise ValueError(
                    "Transaction item not found for tool"
                )

            result = self.return_transaction_item(
                transaction_id=transaction["transactionId"],
                item_id=transaction_item["transactionItemId"]
            )

            # ----------------------------------------------------
            # UPDATE TOOL STATUS
            # ----------------------------------------------------

            self.tool_repository.update_status(
                tool_id=tool_id,
                status="available"
            )

            return result

        # ========================================================
        # INVALID OPERATION
        # ========================================================

        raise ValueError(
            f"Unsupported operation: {operation}"
        )
    # ========================================================
    # HELPER - ENRICH TRANSACTION ITEM
    # ========================================================

    def _enrich_transaction_item(
        self,
        item: dict[str, Any]
    ) -> dict[str, Any]:

        tool = (
            self.tool_repository.get_by_id(
                item["toolId"]
            )
        )

        result = item.copy()

        if tool is not None:
            result["toolName"] = tool.get("name", "")
            result["assetNumber"] = tool.get(
                "assetNumber",
                ""
            )
        else:
            result["toolName"] = ""
            result["assetNumber"] = ""

        return result
transaction_service=TransactionService()