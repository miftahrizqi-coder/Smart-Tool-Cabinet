from app.repositories.employee_repository import EmployeeRepository


class RFIDService:

    def __init__(self):

        self.employee_repository = (
            EmployeeRepository()
        )

    def find_employee_by_rfid(
        self,
        uid: str
    ):

        employee = (
            self.employee_repository
            .get_by_rfid(uid)
        )

        return employee