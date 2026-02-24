from fastapi import APIRouter, HTTPException, Request
from datetime import datetime
from uuid import uuid4
import json
from database.connection import db_manager
from database.repository import EventRepository
from simulator.event_processor import EventProcessor
from domain.enums import EventStatus

router = APIRouter()

@router.post('/{integration_type}')
async def receive_webhook(integration_type: str, request: Request):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail='Invalid JSON payload')

    event_type = payload.get('event_type', 'unknown')
    event_id = str(uuid4())
    now = datetime.utcnow()

    event_data = {
        'event_id': event_id,
        'integration_type': integration_type,
        'event_type': event_type,
        'payload': json.dumps(payload),  # ← proper JSON string
        'status': EventStatus.RECEIVED.value,
        'retry_count': 0,
        'max_retries': 3,
        'correlation_id': str(uuid4()),
        'idempotency_key': payload.get('idempotency_key', event_id),
        'source_ip': request.client.host if request.client else None,
        'created_at': now,
        'updated_at': now,
    }

    with db_manager.get_session() as session:
        event_repo = EventRepository(session)
        created = event_repo.create_event(event_data)

        if not created:
            raise HTTPException(status_code=409, detail='Duplicate event')

        processor = EventProcessor(session)
        result = processor.process(event_data)

    return {
        'event_id': event_id,
        'status': result.get('status'),
        'integration_type': integration_type,
        'event_type': event_type,
    }
