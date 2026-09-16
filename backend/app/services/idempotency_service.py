class IdempotencyService:

    def __init__(self):

        self._processed_events = set()

    def is_processed(
        self,
        event_id: str
    ) -> bool:

        return (
            event_id
            in self._processed_events
        )

    def mark_processed(
        self,
        event_id: str
    ) -> None:

        self._processed_events.add(
            event_id
        )

    def check_and_mark(
        self,
        event_id: str
    ) -> bool:

        if self.is_processed(event_id):

            return False

        self.mark_processed(
            event_id
        )

        return True


idempotency_service = (
    IdempotencyService()
)