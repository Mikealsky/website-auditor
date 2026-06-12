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
    except (HTTPException, Exception):
        return None


async def require_user(authorization: Optional[str] = Header(default=None)) -> dict:
    """FastAPI dependency — raises 401 if no valid token."""
    user = await optional_user(authorization)
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user
