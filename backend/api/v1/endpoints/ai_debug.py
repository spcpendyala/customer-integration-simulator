from fastapi import APIRouter, HTTPException
from database.connection import db_manager
from database.repository import EventRepository, LogRepository
from services.ai_service import ai_service

router = APIRouter()

ANALYZABLE_STATUSES = ['failed', 'permanent_failure', 'timed_out', 'retrying']

@router.post('/{event_id}')
async def analyze_event_failure(event_id: str):
    with db_manager.get_session() as session:
        event_repo = EventRepository(session)
        log_repo = LogRepository(session)

        event = event_repo.get_event(event_id)
        if not event:
            raise HTTPException(status_code=404, detail='Event not found')

        if event['status'] not in ANALYZABLE_STATUSES:
            raise HTTPException(status_code=400, detail=f'Event status {event["status"]} is not analyzable')

        logs = log_repo.get_logs_for_event(event_id)
        logs_text = '\n'.join([
            f"[{l['timestamp']}] {l['level']}: {l['message']}"
            for l in logs
        ])

        analysis = await ai_service.analyze_failure(
            event_type=event['event_type'],
            integration_type=event['integration_type'],
            failure_type=str(event.get('failure_type', 'unknown')),
            failure_reason=event.get('failure_reason') or 'Unknown',
            logs=logs_text,
            retry_count=event.get('retry_count', 0)
        )

    return {'event_id': event_id, 'analysis': analysis}
