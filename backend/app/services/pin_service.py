from argon2 import PasswordHasher
from argon2.exceptions import (
    VerifyMismatchError,
    VerificationError,
    InvalidHashError
)


class PINService:

    def __init__(self):

        self.password_hasher = PasswordHasher()

    def verify(
        self,
        pin: str,
        pin_hash: str
    ) -> bool:

        if not pin_hash:
            return False

        try:

            return self.password_hasher.verify(
                pin_hash,
                pin
            )

        except (
            VerifyMismatchError,
            VerificationError,
            InvalidHashError
        ):

            return False