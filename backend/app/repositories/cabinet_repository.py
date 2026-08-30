from app.firebase.firestore import db


class CabinetRepository:

    COLLECTION = "cabinets"

    def get_all(self):

        docs = (
            db.collection(self.COLLECTION)
            .stream()
        )

        cabinets = []

        for doc in docs:

            cabinet = doc.to_dict()
            cabinet["id"] = doc.id

            cabinets.append(cabinet)

        return cabinets

    def get_by_id(self, cabinet_id: str):

        doc = (
            db.collection(self.COLLECTION)
            .document(cabinet_id)
            .get()
        )

        if not doc.exists:
            return None

        cabinet = doc.to_dict()
        cabinet["id"] = doc.id

        return cabinet

    def get_by_name(self, name: str):

        docs = (
            db.collection(self.COLLECTION)
            .where(
                "name",
                "==",
                name
            )
            .limit(1)
            .stream()
        )

        for doc in docs:

            cabinet = doc.to_dict()
            cabinet["id"] = doc.id

            return cabinet

        return None

    def create(
        self,
        cabinet_id: str,
        data: dict
    ):

        (
            db.collection(self.COLLECTION)
            .document(cabinet_id)
            .set(data)
        )

        return self.get_by_id(cabinet_id)

    def update(
        self,
        cabinet_id: str,
        data: dict
    ):

        (
            db.collection(self.COLLECTION)
            .document(cabinet_id)
            .update(data)
        )

        return self.get_by_id(cabinet_id)