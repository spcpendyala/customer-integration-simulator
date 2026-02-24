from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID, uuid4
from domain.enums import EventStatus, FailureType


@dataclass
class Event:
    integration_type: str
    event_type: str
    payload: Dict[str, Any]
    event_id: UUID = field(default_factory=uuid4)
    status: EventStatus = EventStatus.RECEIVED
    retry_count: int = 0
    max_retries: int = 3
    next_retry_at: Optional[datetime] = None
    failure_type: Optional[FailureType] = None
    failure_reason: Optional[str] = None
    correlation_id: Optional[str] = None
    idempotency_key: Optional[str] = None
    source_ip: Optional[str] = None
    processing_duration_ms: Optional[int] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
