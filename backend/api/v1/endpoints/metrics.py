from fastapi import APIRouter
from sqlalchemy import text
from database.connection import db_manager

router = APIRouter()

@router.get('')
async def get_metrics():
    with db_manager.get_session() as session:
        result = session.execute(text("""
            SELECT
                COUNT(*) as total_events,
                COUNT(*) FILTER (WHERE status = 'success') as successful,
                COUNT(*) FILTER (WHERE status = 'failed') as failed,
                COUNT(*) FILTER (WHERE status = 'permanent_failure') as permanent_failures,
                COUNT(*) FILTER (WHERE status = 'retrying') as retrying,
                COUNT(*) FILTER (WHERE status = 'processing') as processing,
                ROUND(
                    COUNT(*) FILTER (WHERE status = 'success') * 100.0 /
                    NULLIF(COUNT(*), 0), 2
                ) as success_rate,
                ROUND(AVG(processing_duration_ms), 2) as avg_latency_ms
            FROM events
        """))
        row = result.fetchone()
        return dict(row._mapping)
