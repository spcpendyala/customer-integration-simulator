from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID, uuid4
from domain.enums import LogLevel


@dataclass
class EventLog:
    event_id: UUID
    level: LogLevel
    message: str
    log_id: UUID = field(default_factory=uuid4)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None
    exception_type: Optional[str] = None
    stack_trace: Optional[str] = None
    duration_ms: Optional[int] = None
