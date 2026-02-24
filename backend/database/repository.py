from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from domain.enums import EventStatus
import json


class EventRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_event(self, event_data: dict) -> dict:
        payload = event_data.get('payload', '{}')
        if isinstance(payload, dict):
            payload = json.dumps(payload)
        result = self.session.execute(
            text("""
                INSERT INTO events (
                    event_id, integration_type, event_type, payload,
                    status, retry_count, max_retries, correlation_id,
                    idempotency_key, source_ip, created_at, updated_at
                ) VALUES (
                    :event_id, :integration_type, :event_type, cast(:payload as jsonb),
                    :status, :retry_count, :max_retries, :correlation_id,
                    :idempotency_key, :source_ip, :created_at, :updated_at
                )
                ON CONFLICT (idempotency_key) DO NOTHING
                RETURNING *
            """),
            {**event_data, 'payload': payload}
        )
        row = result.fetchone()
        return dict(row._mapping) if row else None

    def get_event(self, event_id: UUID) -> Optional[dict]:
        result = self.session.execute(
            text("SELECT * FROM events WHERE event_id = :event_id"),
            {"event_id": str(event_id)}
        )
        row = result.fetchone()
        return dict(row._mapping) if row else None

    def update_event_status(
        self,
        event_id: UUID,
        status: EventStatus,
        extra_fields: dict = None
    ) -> Optional[dict]:
        fields = {"status": status.value, "updated_at": datetime.utcnow(), "event_id": str(event_id)}
        if extra_fields:
            fields.update(extra_fields)

        set_clause = ", ".join(
            f"{k} = :{k}" for k in fields if k != "event_id"
        )
        result = self.session.execute(
            text(f"UPDATE events SET {set_clause} WHERE event_id = :event_id RETURNING *"),
            fields
        )
        row = result.fetchone()
        return dict(row._mapping) if row else None

    def list_events(self, limit: int = 50, offset: int = 0, status: str = None) -> List[dict]:
        if status:
            result = self.session.execute(
                text("SELECT * FROM events WHERE status = :status ORDER BY created_at DESC LIMIT :limit OFFSET :offset"),
                {"status": status, "limit": limit, "offset": offset}
            )
        else:
            result = self.session.execute(
                text("SELECT * FROM events ORDER BY created_at DESC LIMIT :limit OFFSET :offset"),
                {"limit": limit, "offset": offset}
            )
        return [dict(row._mapping) for row in result.fetchall()]


class LogRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_log(self, log_data: dict) -> dict:
        result = self.session.execute(
            text("""
                INSERT INTO event_logs (
                    log_id, event_id, level, message,
                    metadata, duration_ms, timestamp
                ) VALUES (
                    :log_id, :event_id, :level, :message,
                    cast(:metadata as jsonb), :duration_ms, :timestamp
                ) RETURNING *
            """),
            log_data
        )
        row = result.fetchone()
        return dict(row._mapping) if row else None

    def get_logs_for_event(self, event_id: UUID) -> List[dict]:
        result = self.session.execute(
            text("SELECT * FROM event_logs WHERE event_id = :event_id ORDER BY timestamp ASC"),
            {"event_id": str(event_id)}
        )
        return [dict(row._mapping) for row in result.fetchall()]
