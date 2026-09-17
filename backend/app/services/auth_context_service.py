from datetime import datetime, timedelta


class AuthContextService:

    def __init__(
        self,
        timeout_seconds: int = 60
    ):

        self._contexts = {}

        self.timeout = timedelta(
            seconds=timeout_seconds
        )

    def create_context(
        self,
        event_id: str,
        employee_id: str,
        cabinet_id: str
    ):

        self._contexts[cabinet_id] = {
            "eventId": event_id,
            "employeeId": employee_id,
            "cabinetId": cabinet_id,
            "createdAt": datetime.now()
        }

    def get_context(
        self,
        cabinet_id: str
    ):

        context = self._contexts.get(
            cabinet_id
        )

        if context is None:
            return None

        elapsed = (
            datetime.now()
            - context["createdAt"]
        )

        if elapsed > self.timeout:

            self.remove_context(
                cabinet_id
            )

            return None

        return context

    def remove_context(
        self,
        cabinet_id: str
    ):

        self._contexts.pop(
            cabinet_id,
            None
        )


auth_context_service = AuthContextService()