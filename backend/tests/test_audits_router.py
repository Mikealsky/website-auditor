import pytest
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient, ASGITransport
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from main import app
from auth.firebase import optional_user as original_optional_user


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
    from database import init_db
    await init_db()

    fake_user = {"uid": "test-uid", "email": "test@example.com"}

    async def mock_optional_user():
        return fake_user

    app.dependency_overrides[original_optional_user] = mock_optional_user
    try:
        with patch("services.pagespeed.get_pagespeed_data", new_callable=AsyncMock, return_value={"performance_score": 80, "seo_score": 70, "accessibility_score": 90, "load_time_seconds": "2.1 s", "first_contentful_paint": "1.2 s", "largest_contentful_paint": "2.0 s", "total_blocking_time": "100 ms", "cumulative_layout_shift": "0.05"}), \
             patch("services.scraper.scrape_seo_audit", new_callable=AsyncMock, return_value={"has_title": {"present": True, "value": "Test"}, "has_meta_description": {"present": True}, "has_h1": True, "h1_count": 1, "images_missing_alt": 0, "total_images": 2, "has_https": True, "has_viewport_meta": True, "has_phone_number": False, "has_cta_above_fold": True, "internal_links": 3, "external_links": 1, "word_count": 200}), \
             patch("services.ai_report.generate_report", new_callable=AsyncMock, return_value={"summary": "Looks good.", "recommendations": [], "model": "mock"}):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.post("/api/audit", json={"url": "https://example.com", "business_name": "Test Co"})
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "audit_id" in data["data"]
