from fastapi import APIRouter, HTTPException, status

from app.schemas.transaction import (
    TransactionCreate,
    TransactionItemCreate,
    TransactionResponse,
    TransactionItemResponse,
    TransactionDetailResponse
)

from app.services.transaction_service import (
    TransactionService
)

from app.core.exceptions import AppException


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


transaction_service = TransactionService()


# ============================================================
# CREATE
# ============================================================

@router.post(
    "",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_transaction(
    request: TransactionCreate
):

    try:

        return transaction_service.create_transaction(
            employee_id=request.employeeId,
            cabinet_id=request.cabinetId
        )

    except AppException as e:

        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


# ============================================================
# ACTIVE TRANSACTION BY EMPLOYEE
# ============================================================

@router.get(
    "/employee/{employee_id}/active",
    response_model=TransactionDetailResponse | None
)
def get_active_transaction(
    employee_id: str
):

    try:

        transaction = (
            transaction_service
            .get_active_transaction(employee_id)
        )

        if transaction is None:
            return None

        items = (
            transaction_service
            .get_transaction_items(
                transaction["transactionId"]
            )
        )

        transaction["items"] = items

        return transaction

    except AppException as e:

        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


# ============================================================
# GET TRANSACTION
# ============================================================

@router.get(
    "/{transaction_id}",
    response_model=TransactionDetailResponse
)
def get_transaction(
    transaction_id: str
):

    try:

        transaction = (
            transaction_service
            .get_transaction(transaction_id)
        )

        items = (
            transaction_service
            .get_transaction_items(transaction_id)
        )

        transaction["items"] = items

        return transaction

    except AppException as e:

        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


# ============================================================
# GET ITEMS
# ============================================================

@router.get(
    "/{transaction_id}/items",
    response_model=list[TransactionItemResponse]
)
def get_transaction_items(
    transaction_id: str
):

    try:

        return (
            transaction_service
            .get_transaction_items(transaction_id)
        )

    except AppException as e:

        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


# ============================================================
# ADD ITEM
# ============================================================

@router.post(
    "/{transaction_id}/items",
    response_model=TransactionItemResponse,
    status_code=status.HTTP_201_CREATED
)
def add_transaction_item(
    transaction_id: str,
    request: TransactionItemCreate
):

    try:

        return (
            transaction_service
            .add_transaction_item(
                transaction_id=transaction_id,
                tool_id=request.toolId,
                slot_number=request.slotNumber
            )
        )

    except AppException as e:

        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )


# ============================================================
# RETURN ITEM
# ============================================================

@router.post(
    "/{transaction_id}/items/{item_id}/return",
    response_model=TransactionItemResponse
)
def return_transaction_item(
    transaction_id: str,
    item_id: str
):

    try:

        return (
            transaction_service
            .return_transaction_item(
                transaction_id=transaction_id,
                item_id=item_id
            )
        )

    except AppException as e:

        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )