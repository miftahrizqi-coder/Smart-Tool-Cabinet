from app.firebase.firestore import db


class EmployeeRepository:

    COLLECTION = "employees"

    def get_all(self):

        docs = (
            db.collection(self.COLLECTION)
            .stream()
        )

        employees = []

        for doc in docs:

            employee = doc.to_dict()
            employee["id"] = doc.id

            employees.append(employee)

        return employees

    def get_by_id(self, employee_id: str):

        doc = (
            db.collection(self.COLLECTION)
            .document(employee_id)
            .get()
        )

        if not doc.exists:
            return None

        employee = doc.to_dict()
        employee["id"] = doc.id

        return employee

    def get_by_rfid(self, rfid_uid: str):

        docs = (
            db.collection(self.COLLECTION)
            .where(
                "rfidUid",
                "==",
                rfid_uid
            )
            .limit(1)
            .stream()
        )

        for doc in docs:

            employee = doc.to_dict()
            employee["id"] = doc.id

            return employee

        return None

    def get_by_employee_number(
        self,
        employee_number: str
    ):

        docs = (
            db.collection(self.COLLECTION)
            .where(
                "employeeNumber",
                "==",
                employee_number
            )
            .limit(1)
            .stream()
        )

        for doc in docs:

            employee = doc.to_dict()
            employee["id"] = doc.id

            return employee

        return None

    def create(
        self,
        employee_id: str,
        data: dict
    ):

        (
            db.collection(self.COLLECTION)
            .document(employee_id)
            .set(data)
        )

        return self.get_by_id(employee_id)

    def update(
        self,
        employee_id: str,
        data: dict
    ):

        (
            db.collection(self.COLLECTION)
            .document(employee_id)
            .update(data)
        )

        return self.get_by_id(employee_id)