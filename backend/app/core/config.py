import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    FIREBASE_CREDENTIALS_PATH: str = os.getenv(
        "FIREBASE_CREDENTIALS_PATH",
        "serviceAccountKey.json"
    )


settings = Settings()