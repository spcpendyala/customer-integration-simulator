from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
import logging

logging.basicConfig(level=logging.INFO)

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
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'https://simulator.palaemonsystems.com',
        'https://customer-integration-simulator.vercel.app',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event('startup')
async def startup():
    from database.connection import db_manager
    ok = db_manager.test_connection()
    print('✓ DB connected' if ok else '✗ DB FAILED')

@app.get('/health')
async def health():
    from database.connection import db_manager
    db = db_manager.test_connection()
    return {'status': 'healthy' if db else 'unhealthy', 'database': db}

from api.v1.router import api_router
app.include_router(api_router, prefix='/api/v1')
