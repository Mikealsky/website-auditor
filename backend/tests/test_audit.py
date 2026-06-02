import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from main import app


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_audit_invalid_url():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/audit", json={"url": "not-a-url"})
    assert response.status_code == 422  # Pydantic validation error


@pytest.mark.asyncio
async def test_audit_valid_url():
    """
    Runs a real audit against example.com using mock data (no API keys needed).
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/audit", json={
            "url": "https://example.com",
            "business_name": "Example Co"
        })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "performance" in data["data"]
    assert "seo" in data["data"]
    assert "ai_report" in data["data"]
