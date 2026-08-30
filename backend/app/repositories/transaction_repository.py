from typing import Any

from app.firebase.firestore import db


class TransactionRepository:

    COLLECTION = "transactions"
    ITEMS_COLLECTION = "items"

    # ========================================================
    # TRANSACTION
    # ========================================================

    def create(
        self,
        transaction_id: str,
        data: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Membuat transaction baru.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
        )

        ref.set(data)

        result = data.copy()
        result["transactionId"] = transaction_id

        return result

    # ========================================================

    def get_by_id(
        self,
        transaction_id: str
    ) -> dict[str, Any] | None:
        """
        Mengambil satu transaction berdasarkan ID.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
        )

        document = ref.get()

        if not document.exists:
            return None

        data = document.to_dict()

        data["transactionId"] = document.id

        return data

    # ========================================================

    def get_all(
        self,
        limit: int = 50
    ) -> list[dict[str, Any]]:
        """
        Mengambil daftar transaction.
        """

        documents = (
            db.collection(self.COLLECTION)
            .order_by(
                "createdAt",
                direction="DESCENDING"
            )
            .limit(limit)
            .stream()
        )

        transactions = []

        for document in documents:

            data = document.to_dict()

            data["transactionId"] = document.id

            transactions.append(data)

        return transactions

    # ========================================================

    def get_active_by_employee(
        self,
        employee_id: str
    ) -> dict[str, Any] | None:
        """
        Mengambil transaction aktif milik employee.

        Active transaction:
            status == "open"
        """

        documents = (
            db.collection(self.COLLECTION)
            .where(
                "employeeId",
                "==",
                employee_id
            )
            .where(
                "status",
                "==",
                "open"
            )
            .limit(1)
            .stream()
        )

        for document in documents:

            data = document.to_dict()

            data["transactionId"] = document.id

            return data

        return None

    # ========================================================

    def update(
        self,
        transaction_id: str,
        data: dict[str, Any]
    ) -> dict[str, Any] | None:
        """
        Meng-update field transaction.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
        )

        document = ref.get()

        if not document.exists:
            return None

        ref.update(data)

        updated_document = ref.get()

        result = updated_document.to_dict()

        result["transactionId"] = transaction_id

        return result

    # ========================================================
    # TRANSACTION ITEMS
    # ========================================================

    def add_item(
        self,
        transaction_id: str,
        item_id: str,
        data: dict[str, Any]
    ) -> dict[str, Any]:
        """
        Menambahkan transaction item ke dalam
        subcollection items.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
            .collection(self.ITEMS_COLLECTION)
            .document(item_id)
        )

        ref.set(data)

        result = data.copy()
        result["transactionItemId"] = item_id

        return result

    # ========================================================

    def get_items(
        self,
        transaction_id: str
    ) -> list[dict[str, Any]]:
        """
        Mengambil seluruh transaction items
        dari sebuah transaction.
        """

        documents = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
            .collection(self.ITEMS_COLLECTION)
            .stream()
        )

        items = []

        for document in documents:

            data = document.to_dict()

            data["transactionItemId"] = document.id

            items.append(data)

        return items

    # ========================================================

    def get_item_by_id(
        self,
        transaction_id: str,
        item_id: str
    ) -> dict[str, Any] | None:
        """
        Mengambil satu transaction item.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
            .collection(self.ITEMS_COLLECTION)
            .document(item_id)
        )

        document = ref.get()

        if not document.exists:
            return None

        data = document.to_dict()

        data["transactionItemId"] = document.id

        return data

    # ========================================================

    def update_item(
        self,
        transaction_id: str,
        item_id: str,
        data: dict[str, Any]
    ) -> dict[str, Any] | None:
        """
        Meng-update transaction item.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
            .collection(self.ITEMS_COLLECTION)
            .document(item_id)
        )

        document = ref.get()

        if not document.exists:
            return None

        ref.update(data)

        updated_document = ref.get()

        result = updated_document.to_dict()

        result["transactionItemId"] = item_id

        return result

    # ========================================================

    def delete_item(
        self,
        transaction_id: str,
        item_id: str
    ) -> bool:
        """
        Menghapus transaction item.

        Fungsi ini disediakan untuk kebutuhan administratif/testing.
        Pada business flow normal, item sebaiknya tidak dihapus.
        """

        ref = (
            db.collection(self.COLLECTION)
            .document(transaction_id)
            .collection(self.ITEMS_COLLECTION)
            .document(item_id)
        )

        document = ref.get()

        if not document.exists:
            return False

        ref.delete()

        return True