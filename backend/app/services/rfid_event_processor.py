from app.schemas.rfid import RFIDEvent
from app.services.rfid_service import RFIDService
from app.services.idempotency_service import (
    idempotency_service
)
from app.services.auth_context_service import (
    auth_context_service
)


class RFIDEventProcessor:

    def __init__(self):
        self.rfid_service = RFIDService()

    def process(
        self,
        event: RFIDEvent
    ):

        # =====================================================
        # 1. IDEMPOTENCY CHECK
        # =====================================================

        accepted = (
            idempotency_service
            .check_and_mark(
                event.eventId
            )
        )

        if not accepted:

            return {
                "status": "ignored",
                "reason": "duplicate_event",
                "eventId": event.eventId
            }

        # =====================================================
        # 2. FIND EMPLOYEE
        # =====================================================

        employee = (
            self.rfid_service
            .find_employee_by_rfid(
                event.data.uid
            )
        )

        if employee is None:

            return {
                "status": "rejected",
                "reason": "employee_not_found",
                "eventId": event.eventId
            }

        # =====================================================
        # 3. CHECK EMPLOYEE STATUS
        # =====================================================

        if employee.get("status") != "active":

            return {
                "status": "rejected",
                "reason": "employee_inactive",
                "eventId": event.eventId
            }

        # =====================================================
        # 4. CREATE AUTHENTICATION CONTEXT
        # =====================================================

        auth_context_service.create_context(
            event_id=event.eventId,
            employee_id=employee["employeeId"],
            cabinet_id=event.cabinetId
        )

        # =====================================================
        # 5. EMPLOYEE IDENTIFIED
        # =====================================================

        return {
            "status": "employee_identified",
            "eventId": event.eventId,
            "employeeId": employee["employeeId"],
            "cabinetId": event.cabinetId,
            "nextStep": "enter_pin"
        }