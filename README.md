# Customer Integration Simulator

Production-grade webhook integration testing platform with AI-powered failure analysis, retry orchestration, and real-time observability.

## Live Demo
Coming soon — deploying to Railway + Vercel

## What It Does
Simulates real-world webhook integrations (Stripe, Shopify, CRM) with configurable failure injection, exponential backoff retry logic, and an AI debugger that analyzes failures and suggests fixes.

## Features
- Webhook ingestion from Stripe, Shopify, CRM, and Generic integrations
- 9-state event lifecycle: RECEIVED → VALIDATED → QUEUED → PROCESSING → SUCCESS/FAILED/RETRYING/PERMANENT_FAILURE/TIMED_OUT
- Configurable failure simulation (timeout, network errors, validation errors)
- Exponential backoff retry engine (1s → 2s → 4s, max 3 retries)
- Real-time dashboard with auto-refresh every 5 seconds
- AI-powered failure analysis using Claude — root cause, immediate fix, prevention strategy, and code example
- Full audit trail with state transition logs for every event

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Python 3.13, FastAPI, SQLAlchemy |
| Database | PostgreSQL (Supabase) |
| AI | Anthropic Claude API |
| Frontend | React 18, Vite, Tailwind CSS |
| Hosting | Railway (backend), Vercel (frontend) |

## Architecture
```
Frontend (React) → FastAPI Backend → PostgreSQL (Supabase)
                                  ↓
                           Claude AI API
```

## Local Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your DATABASE_URL and ANTHROPIC_API_KEY
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend-new
npm install
npm run dev
```

### API Docs
Visit http://localhost:8000/api/docs for full Swagger UI.

## Key Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/webhook/{integration} | Ingest a webhook event |
| GET | /api/v1/events | List all events |
| GET | /api/v1/events/{id}/logs | Get state transition logs |
| GET | /api/v1/metrics | Get success rate and latency stats |
| POST | /api/v1/ai-debug/{id} | AI failure analysis |

## Resume Bullets
- Built production-grade webhook integration simulator with AI-powered debugging
- Implemented 9-state event machine with exponential backoff retry engine
- Integrated Claude AI for automated failure analysis and fix recommendations
- Tech: Python, FastAPI, React, PostgreSQL — deployed on Railway + Vercel
