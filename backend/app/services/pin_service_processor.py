from app.schemas.pin import PINEvent
import uuid
from app.repositories.employee_repository import (
    EmployeeRepository
)

from app.services.mqtt_publisher_service import (
    MQTTPublisherService
)

from app.services.pin_service import PINService

from app.services.auth_context_service import (
    auth_context_service
)

from app.services.idempotency_service import (
    idempotency_service
)

from app.services.transaction_context_service import (
    transaction_context_service
)

class PINEventProcessor:

    MAX_ATTEMPTS = 3

    def __init__(
        self,
        mqtt_publisher: MQTTPublisherService
    ):

        self.employee_repository = (
            EmployeeRepository()
        )

        self.pin_service = PINService()

        self.mqtt_publisher = (
            mqtt_publisher
        )

        self._attempts = {}

    def process(
        self,
        event: PINEvent
    ):

        # =====================================================
        # 1. IDEMPOTENCY
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
        # 2. GET AUTH CONTEXT
        # =====================================================

        context = (
            auth_context_service
            .get_context(
                event.cabinetId
            )
        )

        if context is None:

            return {
                "status": "rejected",
                "reason": "authentication_context_expired",
                "eventId": event.eventId
            }

        employee_id = context["employeeId"]

        # =====================================================
        # 3. GET EMPLOYEE
        # =====================================================

        employee = (
            self.employee_repository
            .get_by_id(
                employee_id
            )
        )

        if employee is None:

            auth_context_service.remove_context(
                event.cabinetId
            )

            self._attempts.pop(
                event.cabinetId,
                None
            )

            return {
                "status": "rejected",
                "reason": "employee_not_found",
                "eventId": event.eventId
            }

        # =====================================================
        # 4. CHECK ATTEMPT
        # =====================================================

        attempts = self._attempts.get(
            event.cabinetId,
            0
        )

        if attempts >= self.MAX_ATTEMPTS:

            auth_context_service.remove_context(
                event.cabinetId
            )

            self._attempts.pop(
                event.cabinetId,
                None
            )

            return {
                "status": "rejected",
                "reason": "too_many_attempts",
                "eventId": event.eventId
            }

        # =====================================================
        # 5. GET PIN
        # =====================================================

        pin = event.data.pin

        pin_hash = employee.get(
            "pinHash"
        )

        # =====================================================
        # 6. VERIFY PIN
        # =====================================================

        valid = self.pin_service.verify(
            pin,
            pin_hash
        )

        # =====================================================
        # 7. INVALID PIN
        # =====================================================

        if not valid:

            attempts += 1

            self._attempts[
                event.cabinetId
            ] = attempts

            remaining = (
                self.MAX_ATTEMPTS
                - attempts
            )

            if remaining <= 0:

                auth_context_service.remove_context(
                    event.cabinetId
                )

                self._attempts.pop(
                    event.cabinetId,
                    None
                )

                return {
                    "status": "rejected",
                    "reason": "too_many_attempts",
                    "eventId": event.eventId
                }

            return {
                "status": "rejected",
                "reason": "invalid_pin",
                "remainingAttempts": remaining,
                "eventId": event.eventId
            }

        # =====================================================
        # 8. SUCCESS
        # =====================================================

        self._attempts.pop(
            event.cabinetId,
            None
        )

        transaction_context_service.create_context(
            employee_id=employee_id,
            cabinet_id=event.cabinetId
        )

        command_id = (
            f"CMD-OPEN-{event.eventId}"
        )

        command_result = (
            self.mqtt_publisher.publish_command(
                cabinet_id=event.cabinetId,
                command="OPEN_DOOR",
                command_id=command_id,
                target="LOCK"
            )
        )

        return {
            "status": "authenticated",
            "employeeId": employee_id,
            "cabinetId": event.cabinetId,
            "eventId": event.eventId,
            "commandId": command_id,
            "commandResult": command_result,
            "nextStep": "wait_for_tool_event"
            
        }

