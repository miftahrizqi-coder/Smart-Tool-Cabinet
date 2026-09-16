from typing import Any

from app.firebase.firestore import db


class EventRepository:

    COLLECTION = "events"

    # ========================================================
    # CREATE
    # ========================================================

    def create(
        self,
        event_id: str,
        data: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Menyimpan event ke Firestore.

        Document:
            events/{event_id}
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(event_id)
        )

        ref.set(data)

        result = data.copy()
        result["eventId"] = event_id

        return result

    # ========================================================
    # GET BY ID
    # ========================================================

    def get_by_id(
        self,
        event_id: str
    ) -> dict[str, Any] | None:
        """
        Mengambil satu event berdasarkan eventId.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(event_id)
        )

        document = ref.get()

        if not document.exists:
            return None

        data = document.to_dict()

        data["eventId"] = document.id

        return data

    # ========================================================
    # GET ALL
    # ========================================================

    def get_all(
        self,
        limit: int = 50
    ) -> list[dict[str, Any]]:
        """
        Mengambil daftar event terbaru.
        """

        documents = (
            db.collection(self.COLLECTION)
            .order_by(
                "timestamp",
                direction="DESCENDING"
            )
            .limit(limit)
            .stream()
        )

        events = []

        for document in documents:

            data = document.to_dict()

            data["eventId"] = document.id

            events.append(data)

        return events

    # ========================================================
    # EXISTS
    # ========================================================

    def exists(
        self,
        event_id: str
    ) -> bool:
        """
        Mengecek apakah event sudah tersimpan.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(event_id)
        )

        document = ref.get()

        return document.exists