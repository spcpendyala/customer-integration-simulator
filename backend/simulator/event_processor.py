import random
import time
from datetime import datetime, timedelta
from uuid import uuid4
from domain.enums import EventStatus, FailureType, LogLevel
from core.config import settings


class FailureEngine:
    def __init__(self, failure_rate: float = None):
        self.failure_rate = failure_rate or settings.default_failure_rate

    def determine_outcome(self) -> tuple[str, FailureType | None]:
        roll = random.random()

        if roll < 0.50:
            return 'success', None
        elif roll < 0.65:
            return 'temporary_failure', FailureType.SERVER_ERROR
        elif roll < 0.75:
            return 'timeout', FailureType.TIMEOUT
        elif roll < 0.95:
            return 'high_latency', None
        else:
            return 'permanent_failure', FailureType.VALIDATION_ERROR


class EventProcessor:
    def __init__(self, db_session):
        self.session = db_session
        self.failure_engine = FailureEngine()

    def process(self, event_data: dict) -> dict:
        from database.repository import EventRepository, LogRepository
        event_repo = EventRepository(self.session)
        log_repo = LogRepository(self.session)

        event_id = event_data['event_id']
        start_time = time.time()

        # RECEIVED → VALIDATED
        event_repo.update_event_status(event_id, EventStatus.VALIDATED)
        log_repo.create_log({
            'log_id': str(uuid4()),
            'event_id': str(event_id),
            'level': LogLevel.INFO.value,
            'message': f'Event validated: RECEIVED → VALIDATED',
            'metadata': '{"previous": "received", "new": "validated"}',
            'duration_ms': None,
            'timestamp': datetime.utcnow()
        })

        # VALIDATED → QUEUED
        event_repo.update_event_status(event_id, EventStatus.QUEUED)
        log_repo.create_log({
            'log_id': str(uuid4()),
            'event_id': str(event_id),
            'level': LogLevel.INFO.value,
            'message': 'Event queued: VALIDATED → QUEUED',
            'metadata': '{"previous": "validated", "new": "queued"}',
            'duration_ms': None,
            'timestamp': datetime.utcnow()
        })

        # QUEUED → PROCESSING
        event_repo.update_event_status(event_id, EventStatus.PROCESSING)
        log_repo.create_log({
            'log_id': str(uuid4()),
            'event_id': str(event_id),
            'level': LogLevel.INFO.value,
            'message': 'Processing started: QUEUED → PROCESSING',
            'metadata': '{"previous": "queued", "new": "processing"}',
            'duration_ms': None,
            'timestamp': datetime.utcnow()
        })

        # Simulate processing time
        outcome, failure_type = self.failure_engine.determine_outcome()
        latency_ms = int((time.time() - start_time) * 1000)

        if outcome == 'success' or outcome == 'high_latency':
            if outcome == 'high_latency':
                time.sleep(random.uniform(0.5, 1.0))
            latency_ms = int((time.time() - start_time) * 1000)
            event_repo.update_event_status(
                event_id, EventStatus.SUCCESS,
                {'processing_duration_ms': latency_ms, 'processed_at': datetime.utcnow()}
            )
            log_repo.create_log({
                'log_id': str(uuid4()),
                'event_id': str(event_id),
                'level': LogLevel.INFO.value,
                'message': f'Event processed successfully: PROCESSING → SUCCESS',
                'metadata': f'{{"previous": "processing", "new": "success", "latency_ms": {latency_ms}}}',
                'duration_ms': latency_ms,
                'timestamp': datetime.utcnow()
            })
            return {'status': 'success', 'latency_ms': latency_ms}

        elif outcome == 'timeout':
            event_repo.update_event_status(
                event_id, EventStatus.TIMED_OUT,
                {'failure_type': failure_type.value, 'failure_reason': 'Processing timeout'}
            )
            log_repo.create_log({
                'log_id': str(uuid4()),
                'event_id': str(event_id),
                'level': LogLevel.ERROR.value,
                'message': 'Event timed out: PROCESSING → TIMED_OUT',
                'metadata': f'{{"previous": "processing", "new": "timed_out", "retry_count": {event_data.get("retry_count", 0)}}}',
                'duration_ms': latency_ms,
                'timestamp': datetime.utcnow()
            })
            return self._handle_retry(event_id, event_data, event_repo, log_repo, failure_type)

        elif outcome == 'temporary_failure':
            event_repo.update_event_status(
                event_id, EventStatus.FAILED,
                {'failure_type': failure_type.value, 'failure_reason': 'Temporary server error'}
            )
            log_repo.create_log({
                'log_id': str(uuid4()),
                'event_id': str(event_id),
                'level': LogLevel.ERROR.value,
                'message': 'Event failed: PROCESSING → FAILED',
                'metadata': f'{{"previous": "processing", "new": "failed", "retry_count": {event_data.get("retry_count", 0)}}}',
                'duration_ms': latency_ms,
                'timestamp': datetime.utcnow()
            })
            return self._handle_retry(event_id, event_data, event_repo, log_repo, failure_type)

        else:  # permanent_failure
            event_repo.update_event_status(
                event_id, EventStatus.PERMANENT_FAILURE,
                {'failure_type': failure_type.value, 'failure_reason': 'Permanent failure - malformed payload'}
            )
            log_repo.create_log({
                'log_id': str(uuid4()),
                'event_id': str(event_id),
                'level': LogLevel.ERROR.value,
                'message': 'Permanent failure: PROCESSING → PERMANENT_FAILURE',
                'metadata': '{"previous": "processing", "new": "permanent_failure"}',
                'duration_ms': latency_ms,
                'timestamp': datetime.utcnow()
            })
            return {'status': 'permanent_failure', 'latency_ms': latency_ms}

    def _handle_retry(self, event_id, event_data, event_repo, log_repo, failure_type) -> dict:
        retry_count = event_data.get('retry_count', 0)
        max_retries = event_data.get('max_retries', settings.max_retries)

        if retry_count < max_retries:
            wait_seconds = 2 ** retry_count
            next_retry_at = datetime.utcnow() + timedelta(seconds=wait_seconds)
            new_retry_count = retry_count + 1

            event_repo.update_event_status(
                event_id, EventStatus.RETRYING,
                {
                    'retry_count': new_retry_count,
                    'next_retry_at': next_retry_at
                }
            )
            log_repo.create_log({
                'log_id': str(uuid4()),
                'event_id': str(event_id),
                'level': LogLevel.WARNING.value,
                'message': f'Retry scheduled: → RETRYING (attempt {new_retry_count}/{max_retries}, wait {wait_seconds}s)',
                'metadata': f'{{"retry_count": {new_retry_count}, "wait_seconds": {wait_seconds}, "next_retry_at": "{next_retry_at.isoformat()}"}}',
                'duration_ms': None,
                'timestamp': datetime.utcnow()
            })
            return {'status': 'retrying', 'retry_count': new_retry_count, 'wait_seconds': wait_seconds}
        else:
            event_repo.update_event_status(
                event_id, EventStatus.PERMANENT_FAILURE,
                {'failure_type': failure_type.value, 'failure_reason': 'Max retries exhausted'}
            )
            log_repo.create_log({
                'log_id': str(uuid4()),
                'event_id': str(event_id),
                'level': LogLevel.ERROR.value,
                'message': f'Max retries exhausted: → PERMANENT_FAILURE (after {retry_count} retries)',
                'metadata': f'{{"retry_count": {retry_count}, "max_retries": {max_retries}}}',
                'duration_ms': None,
                'timestamp': datetime.utcnow()
            })
            return {'status': 'permanent_failure', 'retry_count': retry_count}
