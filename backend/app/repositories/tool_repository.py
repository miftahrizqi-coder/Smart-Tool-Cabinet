from typing import Optional

from app.firebase.firestore import db


class ToolRepository:

    COLLECTION = "tools"

    def get_all(self):
        docs = db.collection(self.COLLECTION).stream()

        tools = []

        for doc in docs:
            tool = doc.to_dict()
            tool["id"] = doc.id

            tools.append(tool)

        return tools

    def get_by_id(self, tool_id: str):
        doc = (
            db.collection(self.COLLECTION)
            .document(tool_id)
            .get()
        )

        if not doc.exists:
            return None

        tool = doc.to_dict()
        tool["id"] = doc.id

        return tool

    def create(self, tool_id: str, data: dict):
        db.collection(self.COLLECTION) \
            .document(tool_id) \
            .set(data)

        return self.get_by_id(tool_id)

    def update(self, tool_id: str, data: dict):
        db.collection(self.COLLECTION) \
            .document(tool_id) \
            .update(data)

        return self.get_by_id(tool_id)

    def exists(self, tool_id: str) -> bool:
        doc = (
            db.collection(self.COLLECTION)
            .document(tool_id)
            .get()
        )

        return doc.exists

    def find_by_slot(
        self,
        cabinet_id: str,
        slot_number: int
    ):
        docs = (
            db.collection(self.COLLECTION)
            .where(
                "cabinetId",
                "==",
                cabinet_id
            )
            .where(
                "slotNumber",
                "==",
                slot_number
            )
            .limit(1)
            .stream()
        )

        for doc in docs:
            tool = doc.to_dict()
            tool["id"] = doc.id
            return tool

        return None

    def get_by_cabinet_and_slot(
        self,
        cabinet_id: str,
        slot_number: int
    ):

        docs = (
            db.collection(self.COLLECTION)
            .where(
                "cabinetId",
                "==",
                cabinet_id
            )
            .where(
                "slotNumber",
                "==",
                slot_number
            )
            .limit(1)
            .stream()
        )

        for doc in docs:

            tool = doc.to_dict()
            tool["id"] = doc.id

            return tool

        return None