# 🚀 Launch Tracker Dashboard

**Launch Tracker** is a premium monitoring tool that aggregates startup launches across X (Twitter) and LinkedIn. It tracks engagement metrics, provides enriched contact data, and helps automate outreach for companies that need a growth boost.

---

---

## Tech Stack

| Layer       | Technology                       |
| ----------- | -------------------------------- |
| Backend API | Django + Django REST Framework   |
| Database    | SQLite (dev) / PostgreSQL (prod) |
| Frontend    | React (Vite)                     |
| Styling     | Custom CSS                       |

---

## Project Structure

```
dash-board/
├── backend/                  # Django REST API
│   ├── api/
│   │   ├── models.py         # Company, LaunchEvent, ContactInfo, DM_Draft
│   │   ├── serializers.py    # API response schemas
│   │   ├── views.py          # Endpoints (GET companies, POST draft_dm)
│   │   ├── services.py       # DM generation logic
│   │   └── urls.py           # API routing
│   ├── config/               # Django project settings
│   ├── manage.py
│   └── seed_data.py          # Sample data loader
│
├── frontend/                 # React SPA
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx
│       │   ├── CompanyCard.jsx
│       │   ├── ContactBox.jsx
│       │   └── DMDraftPrompt.jsx
│       ├── css/
│       └── utils/api.js      # Base API client
│
└── specs/001-launch-tracker/ # Feature specs and planning docs
```

---

## Features

- **Unified Dashboard** — View all companies with their fundraise amounts and X/LinkedIn launch engagement (likes).
- **Enriched Contact Box** — Each company entry shows email, phone, LinkedIn, and X handles with clickable links.
- **DM Draft Engine** — For launches with low engagement, generate a contextual outreach DM with one click and copy it to clipboard.
- **Poor Performance Detection** — Launches below the engagement threshold are automatically flagged and surface the DM drafting prompt.
- **Social Media Monitor** — Sync engagement metrics (likes/reactions) dynamically via a dedicated service with X and LinkedIn API integration (Mock).
- **Post Analysis Search** — Analyze any X or LinkedIn post by URL to instantly view engagement stats and author info.

---

## First Time Setup (New Clones)

If you just cloned the repository, you need to install dependencies for both the root (orchestrator), frontend, and backend:

### 1. Root & Frontend Dependencies

Run this in the project root:

```bash
npm install && cd frontend && npm install && cd ..
```

_Note: For older versions of PowerShell (pre-v7), use `;` instead of `&&`:_
`npm install; cd frontend; npm install; cd ..`

### 2. Backend Virtual Environment

Run this command in the project root:

```bash
npm run setup:backend
```

### 3. Verify Setup

Run this script to ensure Node.js, Python 3.10+, and all dependencies are installed and configured:

```bash
npm run verify
```

---

## How to Run

### Quick Start (Recommended)

You can run both the backend and frontend simultaneously with a single command from the project root:

```bash
npm run dev
```

---

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm

---

### 1. Start the Backend (Manual)

If you prefer to run it separately:

```bash
npm run dev:backend
```

The Django API will be available at: `http://127.0.0.1:8000/api/companies/`

---

### 2. Start the Frontend (Manual)

If you prefer to run it separately:

```bash
npm run dev:frontend
```

The React app will be available at: `http://localhost:5173`

---

### (Optional) Load Sample Data

To populate the database with 3 sample companies for testing:

```bash
npm run seed:backend
```

---

## API Endpoints

| Method | Endpoint                        | Description                                        |
| ------ | ------------------------------- | -------------------------------------------------- |
| `GET`  | `/api/companies/`               | List all companies with launches and contact info  |
| `POST` | `/api/companies/{id}/draft_dm/` | Generate a DM draft for a poorly performing launch |

### Example `POST /api/companies/{id}/draft_dm/` Request

```json
{ "platform": "X" }
```

### Example Response

```json
{
  "draft_text": "Hey Acme Corp team! ..."
}
```

---

## Notes

- The IDE may show red import errors for `django` and `rest_framework`. These are false positives — the type checker is not pointed at the virtual environment. Fix by selecting `backend\venv\Scripts\python.exe` as your Python interpreter in VS Code (`Ctrl+Shift+P → Python: Select Interpreter`).
- `CORS_ALLOW_ALL_ORIGINS = True` is set for development only. Restrict this before deploying to production.
