# Customer Integration Simulator

A production-grade webhook integration testing platform with real-time observability, failure simulation, and AI-powered root cause analysis.

**Built by [Sai Pendyala](https://linkedin.com/in/saipendyala) — [palaemonsystems.com](https://palaemonsystems.com)**

## Live Demo
🚀 **[simulator.palaemonsystems.com](https://simulator.palaemonsystems.com)**

## What It Does

Real-world webhook integrations fail — silently, unpredictably, and at the worst times. This platform simulates that reality:

- Send test webhooks from Stripe, Shopify, CRM, and Generic integrations
- Watch events move through a 9-state lifecycle in real time
- See failures, retries, and timeouts happen with realistic probability
- Click any failed event → AI debugger explains the root cause, fix, and prevention strategy
- Run scenario presets like "Black Friday Surge" or "Payment Outage" to stress test

## Features

- **Webhook Simulator** — Single events, batch sending (up to 50), and pre-built scenario presets
- **9-State Event Machine** — RECEIVED → VALIDATED → QUEUED → PROCESSING → SUCCESS / FAILED / RETRYING / PERMANENT_FAILURE / TIMED_OUT
- **Failure Injection Engine** — Probabilistic outcomes: timeouts, server errors, validation failures, high latency
- **Exponential Backoff Retry** — Automatic retry with 1s → 2s → 4s delays, max 3 attempts
- **Real-Time Dashboard** — Auto-refreshes every 5 seconds, status filters, pagination
- **AI Debug Assistant** — Powered by Gemini — returns root cause, immediate fix, prevention strategy, and code example for every failure
- **Full Audit Trail** — Every state transition logged with timestamps and metadata

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.13, FastAPI, SQLAlchemy |
| Database | PostgreSQL (Supabase) |
| AI | Google Gemini API |
| Frontend | React 18, Vite, Tailwind CSS |
| Hosting | Railway (backend), Vercel (frontend) |

## Architecture
```
React Dashboard (Vercel)
        ↓
FastAPI Backend (Railway)
        ↓
PostgreSQL — Supabase
        ↓
Gemini AI API (on failure analysis)
```

## Local Setup

### Prerequisites
- Python 3.13+
- Node.js 18+
- Supabase account (free tier)
- Gemini API key (free — no credit card required)

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in DATABASE_URL and GEMINI_API_KEY in .env
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend-new
npm install
npm run dev
```

Visit http://localhost:5174

### API Docs

Visit http://localhost:8000/api/docs for full Swagger UI.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| POST | /api/v1/webhook/{integration} | Ingest a webhook event |
| GET | /api/v1/events | List all events (filterable, paginated) |
| GET | /api/v1/events/{id} | Get single event details |
| GET | /api/v1/events/{id}/logs | Get full state transition log |
| GET | /api/v1/metrics | Success rate, latency, failure counts |
| POST | /api/v1/ai-debug/{id} | AI failure analysis |

## Resume Bullets

- Built production-grade webhook integration simulator processing events through a 9-state machine with probabilistic failure injection and exponential backoff retry logic
- Integrated Google Gemini AI for automated failure analysis — returns root cause, immediate fix, prevention strategy, and code example for every failed event
- Designed real-time observability dashboard with auto-refresh, status filtering, pagination, and full audit trail
- Deployed full stack on Railway + Vercel + Supabase with GitHub CI/CD — zero manual deployments
- Tech: Python, FastAPI, SQLAlchemy, React, Tailwind CSS, PostgreSQL

## Positioning Statement

*"A distributed webhook processing simulation platform with failure injection, retry orchestration, real-time observability, and AI-assisted root cause analysis."*
