from datetime import datetime, timedelta
from typing import Optional


class TransactionContextService:

    def __init__(
        self,
        timeout_seconds: int = 120
    ):

        self._contexts = {}

        self.timeout = timedelta(
            seconds=timeout_seconds
        )

    def create_context(
        self,
        employee_id: str,
        cabinet_id: str
    ):
        now = datetime.now()

        context = {
            "employeeId": employee_id,
            "cabinetId": cabinet_id,
            "status": "ACTIVE",
            "createdAt": now,
            "expiresAt": now + self.timeout,
            "tools": {}
        }

        self._contexts[cabinet_id] = context

        return context

    def get_context(
        self,
        cabinet_id: str
    ) -> Optional[dict]:

        context = self._contexts.get(
            cabinet_id
        )

        if context is None:
            return None

        if datetime.now() > context["expiresAt"]:

            self.remove_context(
                cabinet_id
            )

            return None

        return context

    def add_tool_event(
        self,
        cabinet_id: str,
        tool_id: str,
        operation: str
    ):

        context = self.get_context(
            cabinet_id
        )

        if context is None:
            return False

        context["tools"][tool_id] = {
            "operation": operation,
            "timestamp": datetime.now()
        }

        return True

    def remove_context(
        self,
        cabinet_id: str
    ):

        self._contexts.pop(
            cabinet_id,
            None
        )


transaction_context_service = (
    TransactionContextService()
)