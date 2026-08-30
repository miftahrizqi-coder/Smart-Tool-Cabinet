from datetime import datetime, timezone
from uuid import uuid4

from app.core.security import hash_pin, verify_pin
from app.repositories.employee_repository import (
    EmployeeRepository
)
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate
)


class EmployeeService:

    def __init__(self):

        self.repository = EmployeeRepository()

    @staticmethod
    def normalize_rfid(rfid_uid: str) -> str:

        return (
            rfid_uid
            .replace(":", "")
            .replace("-", "")
            .replace(" ", "")
            .upper()
        )

    def get_all_employees(self):

        return self.repository.get_all()

    def get_employee(self, employee_id: str):

        return self.repository.get_by_id(
            employee_id
        )

    def create_employee(
        self,
        data: EmployeeCreate
    ):

        rfid_uid = self.normalize_rfid(
            data.rfidUid
        )

        existing_rfid = (
            self.repository.get_by_rfid(rfid_uid)
        )

        if existing_rfid:

            raise ValueError(
                "RFID UID sudah terdaftar"
            )

        existing_number = (
            self.repository.get_by_employee_number(
                data.employeeNumber
            )
        )

        if existing_number:

            raise ValueError(
                "Employee number sudah terdaftar"
            )

        employee_id = (
            f"EMP-{uuid4().hex[:8].upper()}"
        )

        now = datetime.now(timezone.utc)

        employee_data = {

            "employeeId": employee_id,

            "employeeNumber":
                data.employeeNumber,

            "name":
                data.name,

            "department":
                data.department,

            "position":
                data.position,

            "rfidUid":
                rfid_uid,

            "pinHash":
                hash_pin(data.pin),

            "status":
                "active",

            "createdAt":
                now,

            "updatedAt":
                now
        }

        return self.repository.create(
            employee_id,
            employee_data
        )

    def update_employee(
        self,
        employee_id: str,
        data: EmployeeUpdate
    ):

        existing = (
            self.repository.get_by_id(
                employee_id
            )
        )

        if not existing:

            return None

        update_data = data.model_dump(
            exclude_unset=True
        )

        if not update_data:

            return existing

        if "rfidUid" in update_data:

            rfid_uid = self.normalize_rfid(
                update_data["rfidUid"]
            )

            existing_rfid = (
                self.repository.get_by_rfid(
                    rfid_uid
                )
            )

            if (
                existing_rfid
                and existing_rfid["id"] != employee_id
            ):

                raise ValueError(
                    "RFID UID sudah digunakan"
                )

            update_data["rfidUid"] = rfid_uid

        if "employeeNumber" in update_data:

            existing_number = (
                self.repository
                .get_by_employee_number(
                    update_data["employeeNumber"]
                )
            )

            if (
                existing_number
                and existing_number["id"] != employee_id
            ):

                raise ValueError(
                    "Employee number sudah digunakan"
                )

        if "pin" in update_data:

            update_data["pinHash"] = hash_pin(
                update_data.pop("pin")
            )

        update_data["updatedAt"] = (
            datetime.now(timezone.utc)
        )

        return self.repository.update(
            employee_id,
            update_data
        )

    def update_status(
        self,
        employee_id: str,
        status: str
    ):

        existing = (
            self.repository.get_by_id(
                employee_id
            )
        )

        if not existing:

            return None

        return self.repository.update(
            employee_id,
            {
                "status": status,
                "updatedAt":
                    datetime.now(timezone.utc)
            }
        )

    def verify_identity(
        self,
        rfid_uid: str,
        pin: str
    ):

        normalized_rfid = (
            self.normalize_rfid(rfid_uid)
        )

        employee = (
            self.repository.get_by_rfid(
                normalized_rfid
            )
        )

        if not employee:

            return None

        if employee.get("status") != "active":

            return None

        pin_hash = employee.get("pinHash")

        if not pin_hash:

            return None

        if not verify_pin(
            pin,
            pin_hash
        ):

            return None

        return employee