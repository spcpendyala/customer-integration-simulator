from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from database.connection import db_manager
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title='Customer Integration Simulator',
    description='Webhook integration testing platform',
    version='1.0.0',
    docs_url='/api/docs',
    redoc_url='/api/redoc'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        settings.frontend_url,
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event('startup')
async def startup():
    print('🚀 Starting CIS')
    ok = db_manager.test_connection()
    print('✓ DB connected' if ok else '✗ DB FAILED')

@app.get('/health')
async def health():
    db = db_manager.test_connection()
    return {'status': 'healthy' if db else 'unhealthy', 'database': db}

from api.v1.router import api_router
app.include_router(api_router, prefix='/api/v1')

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app.main:app', host=settings.host, port=settings.port, reload=True)
