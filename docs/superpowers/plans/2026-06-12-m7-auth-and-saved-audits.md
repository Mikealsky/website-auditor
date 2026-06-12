# M7: User Auth + Saved Audits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google sign-in via Firebase Auth so users can save and revisit past audit results.

**Architecture:** Firebase Auth handles identity on the frontend (Google sign-in, ID tokens). The FastAPI backend verifies ID tokens using Firebase Admin SDK and gates save/list endpoints. Audit results are stored in SQLite (dev) via SQLAlchemy async ORM. The frontend adds an auth button, passes the token with audit requests, and shows a history panel of past audits.

**Tech Stack:** Firebase Auth (JS SDK v9), Firebase Admin SDK (Python), SQLAlchemy 2 async + aiosqlite, React context for auth state.

---

## File Map

### Backend — new files
- `backend/database.py` — async engine, `AsyncSession` factory, `init_db()`
- `backend/models/audit.py` — `AuditRecord` SQLAlchemy model
- `backend/auth/firebase.py` — `verify_firebase_token(token)` → uid/email
- `backend/auth/__init__.py` — empty
- `backend/routers/audits.py` — `GET /api/audits` (list), `GET /api/audits/{id}`

### Backend — modified files
- `backend/routers/audit.py` — save record after audit if token present; accept optional `Authorization` header
- `backend/main.py` — include `audits` router, call `init_db()` on startup
- `backend/.env` / `.env.example` — add `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_JSON`
- `backend/requirements.txt` — add `sqlalchemy[asyncio]`, `aiosqlite`, `firebase-admin`

### Frontend — new files
- `frontend/src/firebase.js` — Firebase app init (reads `VITE_FIREBASE_*` env vars)
- `frontend/src/hooks/useAuth.js` — `useAuth()` hook: `{ user, signIn, signOut, getToken }`
- `frontend/src/components/AuthButton.jsx` — sign-in/sign-out button in header
- `frontend/src/pages/HistoryPage.jsx` — list of past audits, click to expand

### Frontend — modified files
- `frontend/src/App.jsx` — wrap with auth context, pass token to `handleSubmit`, add `history` view
- `frontend/src/pages/HomePage.jsx` — add `AuthButton` to header, show history panel when signed in
- `frontend/.env` / `.env.example` — add `VITE_FIREBASE_*` vars
- `frontend/package.json` — add `firebase`

---

## Task 1: Backend — database layer

**Files:**
- Create: `backend/database.py`
- Create: `backend/models/audit.py`
- Modify: `backend/requirements.txt`

- [ ] **Step 1: Add dependencies**

In `backend/requirements.txt`, add these lines:
```
sqlalchemy[asyncio]>=2.0
aiosqlite>=0.19
firebase-admin>=6.5
```

Run: `pip install sqlalchemy[asyncio] aiosqlite firebase-admin`

- [ ] **Step 2: Create `backend/database.py`**

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./auditor.db")

# sqlite+aiosqlite for dev, postgresql+asyncpg for prod
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

- [ ] **Step 3: Create `backend/models/audit.py`**

```python
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
import uuid


class AuditRecord(Base):
    __tablename__ = "audits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_uid: Mapped[str] = mapped_column(String(128), index=True)
    user_email: Mapped[str] = mapped_column(String(256))
    url: Mapped[str] = mapped_column(String(2048))
    business_name: Mapped[str] = mapped_column(String(256))
    result_json: Mapped[str] = mapped_column(Text)  # full JSON blob of {performance, seo, ai_report}
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
```

- [ ] **Step 4: Write a DB smoke test**

In `backend/tests/test_database.py`:
```python
import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import Base
from models.audit import AuditRecord

TEST_DB = "sqlite+aiosqlite:///:memory:"

@pytest.fixture
async def session():
    engine = create_async_engine(TEST_DB)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    Session = async_sessionmaker(engine, expire_on_commit=False)
    async with Session() as s:
        yield s
    await engine.dispose()

@pytest.mark.asyncio
async def test_insert_and_fetch(session):
    record = AuditRecord(
        user_uid="uid_123",
        user_email="test@example.com",
        url="https://example.com",
        business_name="Example Co",
        result_json='{"performance": {}, "seo": {}, "ai_report": {}}',
    )
    session.add(record)
    await session.commit()

    result = await session.execute(select(AuditRecord).where(AuditRecord.user_uid == "uid_123"))
    row = result.scalar_one()
    assert row.url == "https://example.com"
    assert row.id is not None
```

- [ ] **Step 5: Run test**

```
cd backend
pytest tests/test_database.py -v
```
Expected: `test_insert_and_fetch PASSED`

- [ ] **Step 6: Commit**

```bash
git add backend/database.py backend/models/audit.py backend/tests/test_database.py backend/requirements.txt
git commit -m "feat(m7): add SQLAlchemy async database layer and AuditRecord model"
```

---

## Task 2: Backend — Firebase token verification

**Files:**
- Create: `backend/auth/__init__.py`
- Create: `backend/auth/firebase.py`
- Modify: `backend/.env.example`

- [ ] **Step 1: Update `.env.example`**

Add to `backend/.env.example`:
```
FIREBASE_PROJECT_ID=your-firebase-project-id
# Paste the full service account JSON as a single line (or set path below)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

To get these values:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key" → download JSON
3. Paste the entire JSON (minified) as the value of `FIREBASE_SERVICE_ACCOUNT_JSON`

- [ ] **Step 2: Create `backend/auth/__init__.py`**

Empty file:
```python
```

- [ ] **Step 3: Create `backend/auth/firebase.py`**

```python
import os
import json
from functools import lru_cache
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Header
from typing import Optional


@lru_cache(maxsize=1)
def _get_app() -> firebase_admin.App:
    sa_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", "")
    project_id = os.getenv("FIREBASE_PROJECT_ID", "")
    if sa_json:
        cred = credentials.Certificate(json.loads(sa_json))
    elif project_id:
        # Works in Firebase-hosted environments (no service account needed)
        cred = credentials.ApplicationDefault()
    else:
        raise RuntimeError("Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID in .env")
    return firebase_admin.initialize_app(cred)


def verify_token(token: str) -> dict:
    """Verify a Firebase ID token. Returns decoded token dict with uid and email."""
    _get_app()
    try:
        return auth.verify_id_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid auth token: {e}")


async def optional_user(authorization: Optional[str] = Header(default=None)) -> Optional[dict]:
    """FastAPI dependency — returns decoded token if Authorization header present, else None."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.removeprefix("Bearer ").strip()
    try:
        return verify_token(token)
    except HTTPException:
        return None


async def require_user(authorization: Optional[str] = Header(default=None)) -> dict:
    """FastAPI dependency — raises 401 if no valid token."""
    user = await optional_user(authorization)
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user
```

- [ ] **Step 4: Write auth unit test (mocked)**

In `backend/tests/test_auth.py`:
```python
import pytest
from unittest.mock import patch, MagicMock
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def test_verify_token_invalid():
    """verify_token raises HTTPException for a garbage token."""
    with patch("auth.firebase._get_app", return_value=MagicMock()):
        with patch("firebase_admin.auth.verify_id_token", side_effect=Exception("bad token")):
            from auth.firebase import verify_token
            from fastapi import HTTPException
            with pytest.raises(HTTPException) as exc:
                verify_token("garbage")
            assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_optional_user_no_header():
    from auth.firebase import optional_user
    result = await optional_user(authorization=None)
    assert result is None


@pytest.mark.asyncio
async def test_optional_user_missing_bearer():
    from auth.firebase import optional_user
    result = await optional_user(authorization="Token abc123")
    assert result is None
```

- [ ] **Step 5: Run auth tests**

```
cd backend
pytest tests/test_auth.py -v
```
Expected: all 3 tests PASS

- [ ] **Step 6: Commit**

```bash
git add backend/auth/ backend/.env.example backend/tests/test_auth.py
git commit -m "feat(m7): add Firebase Admin token verification dependency"
```

---

## Task 3: Backend — save audit + list/get endpoints

**Files:**
- Modify: `backend/routers/audit.py`
- Create: `backend/routers/audits.py`
- Modify: `backend/main.py`

- [ ] **Step 1: Update `backend/routers/audit.py` to save on success**

Replace the `run_audit` function body (keep the existing `AuditRequest`, `AuditResponse`, `PdfRequest` models intact):

```python
import json as json_lib
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel, HttpUrl
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from services.pagespeed import get_pagespeed_data
from services.scraper import scrape_seo_audit
from services.ai_report import generate_report
from services.pdf_export import generate_pdf
from auth.firebase import optional_user
from database import get_db
from models.audit import AuditRecord

router = APIRouter()


class AuditRequest(BaseModel):
    url: HttpUrl
    business_name: str = "this business"


class AuditResponse(BaseModel):
    success: bool
    data: dict
    error: str | None = None


class PdfRequest(BaseModel):
    url: str
    business_name: str = "this business"
    performance: dict
    seo: dict
    ai_report: dict


@router.post("/audit", response_model=AuditResponse)
async def run_audit(
    request: AuditRequest,
    user: Optional[dict] = Depends(optional_user),
    db: AsyncSession = Depends(get_db),
):
    url_str = str(request.url)

    try:
        performance = await get_pagespeed_data(url_str)
        seo = await scrape_seo_audit(url_str)
        raw_data = {"performance": performance, "seo": seo}
        ai_report = await generate_report(url_str, request.business_name, raw_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    result_data = {
        "url": url_str,
        "performance": performance,
        "seo": seo,
        "ai_report": ai_report,
    }

    if user:
        record = AuditRecord(
            user_uid=user["uid"],
            user_email=user.get("email", ""),
            url=url_str,
            business_name=request.business_name,
            result_json=json_lib.dumps(result_data),
        )
        db.add(record)
        await db.commit()
        result_data["audit_id"] = record.id

    return AuditResponse(success=True, data=result_data)


@router.post("/pdf")
async def download_pdf(request: PdfRequest):
    try:
        pdf_bytes = generate_pdf(
            url=request.url,
            business_name=request.business_name,
            performance=request.performance,
            seo=request.seo,
            ai_report=request.ai_report,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

    safe_name = "".join(c if c.isalnum() or c in "-_" else "_" for c in request.business_name)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="audit-{safe_name}.pdf"'},
    )
```

- [ ] **Step 2: Create `backend/routers/audits.py`**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json as json_lib

from database import get_db
from models.audit import AuditRecord
from auth.firebase import require_user

router = APIRouter()


@router.get("/audits")
async def list_audits(
    user: dict = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AuditRecord)
        .where(AuditRecord.user_uid == user["uid"])
        .order_by(AuditRecord.created_at.desc())
        .limit(50)
    )
    rows = result.scalars().all()
    return {
        "success": True,
        "data": [
            {
                "id": r.id,
                "url": r.url,
                "business_name": r.business_name,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ],
    }


@router.get("/audits/{audit_id}")
async def get_audit(
    audit_id: str,
    user: dict = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AuditRecord).where(
            AuditRecord.id == audit_id,
            AuditRecord.user_uid == user["uid"],
        )
    )
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Audit not found")
    return {"success": True, "data": json_lib.loads(row.result_json)}
```

- [ ] **Step 3: Update `backend/main.py`**

```python
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).parent / ".env")

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import audit
from routers import audits
from database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Website Auditor API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router, prefix="/api")
app.include_router(audits.router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "ok", "message": "Website Auditor API is running"}
```

- [ ] **Step 4: Write endpoint tests**

In `backend/tests/test_audits_router.py`:
```python
import pytest
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient, ASGITransport
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from main import app


@pytest.mark.asyncio
async def test_list_audits_unauthenticated():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/audits")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_audit_unauthenticated():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/audits/nonexistent-id")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_audit_saves_when_authenticated():
    fake_user = {"uid": "test-uid", "email": "test@example.com"}
    with patch("routers.audit.optional_user", return_value=fake_user), \
         patch("services.pagespeed.get_pagespeed_data", new_callable=AsyncMock, return_value={"performance_score": 80, "seo_score": 70, "accessibility_score": 90, "load_time_seconds": "2.1 s", "first_contentful_paint": "1.2 s", "largest_contentful_paint": "2.0 s", "total_blocking_time": "100 ms", "cumulative_layout_shift": "0.05"}), \
         patch("services.scraper.scrape_seo_audit", new_callable=AsyncMock, return_value={"has_title": {"present": True, "value": "Test"}, "has_meta_description": {"present": True}, "has_h1": True, "h1_count": 1, "images_missing_alt": 0, "total_images": 2, "has_https": True, "has_viewport_meta": True, "has_phone_number": False, "has_cta_above_fold": True, "internal_links": 3, "external_links": 1, "word_count": 200}), \
         patch("services.ai_report.generate_report", new_callable=AsyncMock, return_value={"summary": "Looks good.", "recommendations": [], "model": "mock"}):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/audit", json={"url": "https://example.com", "business_name": "Test Co"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "audit_id" in data["data"]
```

- [ ] **Step 5: Run tests**

```
cd backend
pytest tests/test_audits_router.py -v
```
Expected: all 3 tests PASS

- [ ] **Step 6: Commit**

```bash
git add backend/routers/audit.py backend/routers/audits.py backend/main.py backend/tests/test_audits_router.py
git commit -m "feat(m7): save audits to DB when authenticated, add list/get endpoints"
```

---

## Task 4: Frontend — Firebase SDK setup and auth hook

**Files:**
- Create: `frontend/src/firebase.js`
- Create: `frontend/src/hooks/useAuth.js`
- Modify: `frontend/package.json`
- Modify: `frontend/.env.example` (create if missing)

- [ ] **Step 1: Install Firebase JS SDK**

```
cd frontend
npm install firebase
```

- [ ] **Step 2: Create `frontend/.env.example`**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your_app_id
```

To get these values: Firebase Console → Project Settings → Your apps → Web app → SDK config.

Also copy to `frontend/.env` and fill in real values (never commit `.env`).

- [ ] **Step 3: Create `frontend/src/firebase.js`**

```js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const signOutUser = () => signOut(auth)
```

- [ ] **Step 4: Create `frontend/src/hooks/useAuth.js`**

```js
import { useState, useEffect } from 'react'
import { auth, signInWithGoogle, signOutUser } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out

  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  const getToken = async () => {
    if (!user) return null
    return user.getIdToken()
  }

  return { user, signIn: signInWithGoogle, signOut: signOutUser, getToken }
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/firebase.js frontend/src/hooks/useAuth.js frontend/.env.example frontend/package.json frontend/package-lock.json
git commit -m "feat(m7): add Firebase JS SDK and useAuth hook"
```

---

## Task 5: Frontend — auth button and wiring into App

**Files:**
- Create: `frontend/src/components/AuthButton.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/pages/HomePage.jsx`

- [ ] **Step 1: Create `frontend/src/components/AuthButton.jsx`**

```jsx
export default function AuthButton({ user, onSignIn, onSignOut }) {
  if (user === undefined) return null // still loading auth state

  if (!user) {
    return (
      <button onClick={onSignIn} className="wa-btn wa-btn-ghost wa-btn-sm">
        Sign in with Google
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
        />
      )}
      <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>
        {user.displayName || user.email}
      </span>
      <button onClick={onSignOut} className="wa-btn wa-btn-ghost wa-btn-sm">
        Sign out
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Update `frontend/src/App.jsx`**

```jsx
import { useState } from 'react'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import LoadingScreen from './components/LoadingScreen'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const [view, setView] = useState('home')
  const [auditData, setAuditData] = useState(null)
  const [businessName, setBusinessName] = useState('this business')
  const [currentUrl, setCurrentUrl] = useState('')
  const [error, setError] = useState(null)
  const { user, signIn, signOut, getToken } = useAuth()

  const handleSubmit = async ({ url, businessName: name }) => {
    setView('loading')
    setCurrentUrl(url)
    setError(null)
    setBusinessName(name || 'this business')

    try {
      const token = await getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url, business_name: name }),
      })

      const json = await response.json()
      if (!response.ok) throw new Error(json.detail || 'Audit failed. Please try again.')

      setAuditData(json.data)
      setView('results')
    } catch (err) {
      setError(err.message)
      setView('home')
    }
  }

  const handleReset = () => {
    setView('home')
    setAuditData(null)
    setError(null)
  }

  const handleViewAudit = (auditData) => {
    setAuditData(auditData)
    setBusinessName(auditData.business_name || 'this business')
    setView('results')
  }

  if (view === 'loading') return <LoadingScreen url={currentUrl} />
  if (view === 'results') return (
    <ResultsPage data={auditData} businessName={businessName} onReset={handleReset} />
  )
  return (
    <HomePage
      onSubmit={handleSubmit}
      error={error}
      user={user}
      onSignIn={signIn}
      onSignOut={signOut}
      getToken={getToken}
      onViewAudit={handleViewAudit}
    />
  )
}
```

- [ ] **Step 3: Update `frontend/src/pages/HomePage.jsx` — add AuthButton to header**

In the `<header>` block, after the logo/title div, add `AuthButton`:

```jsx
// At top of file, add import:
import AuthButton from '../components/AuthButton'

// Replace the header JSX:
<header style={{ background: 'var(--ink)', color: '#fff', borderRadius: 'var(--r-lg)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', color: 'var(--ink)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 16 }}>W</div>
    <div>
      <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>Website Auditor</div>
      <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12 }}>Free local-business check-up</div>
    </div>
  </div>
  <AuthButton user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
</header>
```

Also update the component signature to accept the new props:
```jsx
export default function HomePage({ onSubmit, error, user, onSignIn, onSignOut, getToken, onViewAudit }) {
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/AuthButton.jsx frontend/src/App.jsx frontend/src/pages/HomePage.jsx
git commit -m "feat(m7): add auth button and pass Firebase token with audit requests"
```

---

## Task 6: Frontend — audit history panel

**Files:**
- Create: `frontend/src/pages/HistoryPage.jsx`
- Modify: `frontend/src/pages/HomePage.jsx`

- [ ] **Step 1: Create `frontend/src/pages/HistoryPage.jsx`**

```jsx
import { useState, useEffect } from 'react'

export default function HistoryPage({ getToken, onViewAudit, onClose }) {
  const [records, setRecords] = useState(null) // null = loading
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await getToken()
        const res = await fetch('/api/audits', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Could not load history.')
        const json = await res.json()
        if (!cancelled) setRecords(json.data)
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const handleOpen = async (id) => {
    try {
      const token = await getToken()
      const res = await fetch(`/api/audits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      onViewAudit(json.data)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="wa-card" style={{ padding: 24, marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>Past audits</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--muted)', lineHeight: 1 }}>×</button>
      </div>

      {error && <p style={{ fontSize: 13, color: 'var(--red)' }}>{error}</p>}

      {records === null && !error && (
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Loading…</p>
      )}

      {records?.length === 0 && (
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>No audits saved yet. Run your first audit above.</p>
      )}

      {records?.map((r) => (
        <button
          key={r.id}
          onClick={() => handleOpen(r.id)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', padding: '10px 0', borderBottom: '1px solid var(--line-2)', cursor: 'pointer', textAlign: 'left', gap: 12 }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.business_name}
            </div>
            <div className="wa-mono" style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.url.replace(/^https?:\/\//, '')}
            </div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted-2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {new Date(r.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
          </span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Add history toggle to `frontend/src/pages/HomePage.jsx`**

Add to the component:
```jsx
import HistoryPage from './HistoryPage'

// Add state inside the component:
const [showHistory, setShowHistory] = useState(false)

// After the examples row, add:
{user && (
  <div>
    {!showHistory ? (
      <button
        onClick={() => setShowHistory(true)}
        className="wa-pill"
        style={{ fontSize: 13, color: 'var(--muted)' }}
      >
        View past audits →
      </button>
    ) : (
      <HistoryPage
        getToken={getToken}
        onViewAudit={onViewAudit}
        onClose={() => setShowHistory(false)}
      />
    )}
  </div>
)}
```

- [ ] **Step 3: Manually test the full flow**

1. Start backend: `cd backend && python -m uvicorn main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5173`
4. Click "Sign in with Google" — Firebase popup should appear
5. After sign-in, run an audit on any URL
6. Click "View past audits" — your audit should appear in the list
7. Click the audit row — should load the results page with that audit's data
8. Sign out — "View past audits" should disappear

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/HistoryPage.jsx frontend/src/pages/HomePage.jsx
git commit -m "feat(m7): add audit history panel for signed-in users"
```

---

## Task 7: Final wiring and env var documentation

**Files:**
- Modify: `backend/.env.example`
- Modify: `frontend/.env.example`
- Modify: `.gitignore` (verify `frontend/.env` is ignored)

- [ ] **Step 1: Verify `.gitignore` covers frontend env**

Check `.gitignore` contains:
```
.env
frontend/.env
backend/.env
```

If any are missing, add them.

- [ ] **Step 2: Run full backend test suite**

```
cd backend
pytest tests/ -v
```
Expected: all existing tests plus new tests PASS. No failures.

- [ ] **Step 3: Final commit**

```bash
git add .env.example frontend/.env.example .gitignore
git commit -m "feat(m7): complete — user auth, saved audits, history panel"
```

---

## Self-Review

**Spec coverage:**
- [x] Firebase Auth — Tasks 4, 5
- [x] Save past audits — Tasks 1, 3
- [x] View past audits — Task 6
- [x] SQLite dev DB — Task 1
- [x] Auth gates save (optional — saves only when token present) — Task 3
- [x] Auth gates list/get (required) — Task 3

**Gaps noted:**
- Pagination on `/api/audits` not implemented (limit 50 is sufficient for MVP)
- No delete-audit endpoint (not in M7 spec)
- No account page (not in spec)

**Type consistency check:** `AuditRecord.result_json` (Text) is written and read as `json_lib.dumps/loads` consistently across Tasks 1 and 3. `user_uid` key matches Firebase's `decoded_token["uid"]` in Task 2 and 3.
