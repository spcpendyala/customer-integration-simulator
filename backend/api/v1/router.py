from fastapi import APIRouter
from api.v1.endpoints import webhooks, events, metrics, ai_debug

api_router = APIRouter()
api_router.include_router(webhooks.router, prefix='/webhook', tags=['Webhooks'])
api_router.include_router(events.router, prefix='/events', tags=['Events'])
api_router.include_router(metrics.router, prefix='/metrics', tags=['Metrics'])
api_router.include_router(ai_debug.router, prefix='/ai-debug', tags=['AI Debug'])
