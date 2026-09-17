from app.firebase.firestore import db


class ToolRepository:

    COLLECTION = "tools"

    # ========================================================
    # GET ALL TOOLS
    # ========================================================

    def get_all(self):
        docs = (
            db.collection(self.COLLECTION)
            .stream()
        )

        tools = []

        for doc in docs:
            tool = doc.to_dict()
            tool["id"] = doc.id

            tools.append(tool)

        return tools

    # ========================================================
    # GET TOOL BY ID
    # ========================================================

    def get_by_id(
        self,
        tool_id: str
    ):
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

    # ========================================================
    # CREATE TOOL
    # ========================================================

    def create(
        self,
        tool_id: str,
        data: dict
    ):
        (
            db.collection(self.COLLECTION)
            .document(tool_id)
            .set(data)
        )

        return self.get_by_id(tool_id)

    # ========================================================
    # UPDATE TOOL
    # ========================================================

    def update(
        self,
        tool_id: str,
        data: dict
    ):
        (
            db.collection(self.COLLECTION)
            .document(tool_id)
            .update(data)
        )

        return self.get_by_id(tool_id)

    # ========================================================
    # CHECK TOOL EXISTS
    # ========================================================

    def exists(
        self,
        tool_id: str
    ) -> bool:

        doc = (
            db.collection(self.COLLECTION)
            .document(tool_id)
            .get()
        )

        return doc.exists

    # ========================================================
    # FIND TOOL BY SLOT
    # ========================================================

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

    # ========================================================
    # GET TOOL BY CABINET + SLOT
    # ========================================================

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

    # ========================================================
    # GET TOOL BY SLOT
    # ========================================================

    def get_by_slot(
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

            data = doc.to_dict()
            data["id"] = doc.id

            return data

        return None

    # ========================================================
    # UPDATE SLOT STATUS
    # ========================================================

    def update_slot_status(
        self,
        tool_id: str,
        slot_status: str
    ):
        (
            db.collection(self.COLLECTION)
            .document(tool_id)
            .update({
                "slotStatus": slot_status
            })
        )

        return self.get_by_id(tool_id)

    def update_status(
        self,
        tool_id: str,
        status: str
    ):
        ref = (
            db.collection(self.COLLECTION)
            .document(tool_id)
        )

        document = ref.get()

        if not document.exists:
            return None

        ref.update({
            "status": status
        })

        updated_document = ref.get()

        result = updated_document.to_dict()
        result["id"] = updated_document.id

        return result