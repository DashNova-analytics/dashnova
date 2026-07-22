# DashNova Clean Architecture Documentation

This document describes the scalable layout of the DashNova platform.

## Folder Layout

### Frontend Architecture
The frontend is built as an offline-first single page application (SPA) with React, Vite, Tailwind CSS, Recharts, and React Router.

```text
src/
├── components/          # Reusable presentation and layout components
│   ├── layout/          # Top-level application layout (Sidebar, Navbar, Main Layout)
│   ├── dashboard/       # Dashboard widgets (KPI cards, charts, insight feeds)
│   ├── analytics/       # Analytics sub-modules (Revenue, Customers, Regional)
│   ├── chat/            # Gemini Chat interface (Message list, inputs, suggestions)
│   ├── reports/         # Reports generator list and exporter panel
│   ├── upload/          # Drag & Drop file ingestion and uploading state handlers
│   ├── tables/          # Table structures for Customer & Product listing
│   ├── charts/          # Modular Recharts implementations
│   ├── common/          # Shared components (Loaders, Modals, States)
│   └── clerk/           # Styled mock authentication components
├── pages/               # Fully-contained router pages
├── hooks/               # Custom business state hooks
├── services/            # Axios request configurations and API wrappers
├── routes/              # Client-side router map
└── utils/               # Formatters, mathematical helper, and date calculators
```

### Backend Architecture (FastAPI & PostgreSQL)
The backend is prepared for production with FastAPI and SQLAlchemy ORM, adhering to a domain-driven design structure.

```text
backend/
├── app/
│   ├── api/             # FastAPI routing modules
│   │   ├── auth.py      # JWT validation and scopes
│   │   ├── dashboard.py # Aggregate statistics queries
│   │   ├── analytics.py # Dynamic metrics generator endpoints
│   │   ├── ai.py        # Gemini interaction agent and forecasting predictions
│   │   └── upload.py    # CSV/Excel parser and stream upload ingestion
│   ├── services/        # Business logic managers
│   ├── models/          # SQLAlchemy Database entities (Product, Transaction, Customer)
│   ├── schemas/         # Pydantic serialization models
│   ├── middleware/      # CORS, CORS exception logging, and Auth checks
│   ├── database/        # Session manager and migrations setup
│   ├── ai/              # AI-specific prompts, agents, and prediction models
│   │   ├── prompts/     # Gemini system and grounding prompts
│   │   └── forecast.py  # Prophet/ML Forecasting engine
│   └── config/          # Environment configuration variables
```

---

## Authentication Integration
DashNova integrates **Clerk** for user authentication and organization switching:
1. **Frontend Integration**: Employs `@clerk/clerk-react` standard hooks and widgets (`SignIn`, `SignUp`, `UserButton`, `OrganizationSwitcher`).
2. **Backend Protection**: Incoming requests contain a Bearer JWT issued by Clerk. FastAPI's dependencies decode this JWT using Clerk's JSON Web Key Set (JWKS), ensuring robust and secure route protection.
