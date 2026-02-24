from fastapi import APIRouter, HTTPException, Query
from database.connection import db_manager
from database.repository import EventRepository, LogRepository

router = APIRouter()

@router.get('')
async def list_events(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status: str = Query(None)
):
    with db_manager.get_session() as session:
        repo = EventRepository(session)
        return repo.list_events(limit=limit, offset=offset, status=status)

@router.get('/{event_id}')
async def get_event(event_id: str):
    with db_manager.get_session() as session:
        repo = EventRepository(session)
        event = repo.get_event(event_id)
        if not event:
            raise HTTPException(status_code=404, detail='Event not found')
        return event

@router.get('/{event_id}/logs')
async def get_event_logs(event_id: str):
    with db_manager.get_session() as session:
        log_repo = LogRepository(session)
        return log_repo.get_logs_for_event(event_id)

@router.post('/{event_id}/retry')
async def retry_event(event_id: str):
    with db_manager.get_session() as session:
        event_repo = EventRepository(session)
        event = event_repo.get_event(event_id)
        if not event:
            raise HTTPException(status_code=404, detail='Event not found')
        if event['status'] not in ['failed', 'timed_out']:
            raise HTTPException(status_code=400, detail=f'Event status {event["status"]} is not retryable')

        from simulator.event_processor import EventProcessor
        processor = EventProcessor(session)
        result = processor.process(event)
        return {'event_id': event_id, 'result': result}
