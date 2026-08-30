class AppException(Exception):
    """
    Base exception untuk business logic aplikasi.
    """

    def __init__(
        self,
        message: str,
        status_code: int = 400
    ):
        self.message = message
        self.status_code = status_code

        super().__init__(message)


class NotFoundException(AppException):
    """
    Data tidak ditemukan.
    """

    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=404
        )


class ConflictException(AppException):
    """
    Konflik dengan kondisi data saat ini.
    """

    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=409
        )


class ValidationException(AppException):
    """
    Data tidak memenuhi business rule.
    """

    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=400
        )