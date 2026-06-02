import httpx
import os


PAGESPEED_API_KEY = os.getenv("PAGESPEED_API_KEY", "")
PAGESPEED_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"


async def get_pagespeed_data(url: str) -> dict:
    """
    Calls Google PageSpeed Insights API and returns key performance metrics.
    Falls back to mock data if no API key is set (useful for development).
    """
    if not PAGESPEED_API_KEY:
        return _mock_pagespeed_data()

    params = {
        "url": url,
        "key": PAGESPEED_API_KEY,
        "strategy": "mobile",  # mobile-first, as Google ranks on mobile
        "category": ["performance", "seo", "accessibility"],
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(PAGESPEED_URL, params=params)
        response.raise_for_status()
        raw = response.json()

    categories = raw.get("lighthouseResult", {}).get("categories", {})
    audits = raw.get("lighthouseResult", {}).get("audits", {})

    return {
        "performance_score": int(categories.get("performance", {}).get("score", 0) * 100),
        "seo_score": int(categories.get("seo", {}).get("score", 0) * 100),
        "accessibility_score": int(categories.get("accessibility", {}).get("score", 0) * 100),
        "load_time_seconds": audits.get("interactive", {}).get("displayValue", "N/A"),
        "first_contentful_paint": audits.get("first-contentful-paint", {}).get("displayValue", "N/A"),
        "largest_contentful_paint": audits.get("largest-contentful-paint", {}).get("displayValue", "N/A"),
        "total_blocking_time": audits.get("total-blocking-time", {}).get("displayValue", "N/A"),
        "cumulative_layout_shift": audits.get("cumulative-layout-shift", {}).get("displayValue", "N/A"),
    }


def _mock_pagespeed_data() -> dict:
    """Returns mock data for development without an API key."""
    return {
        "performance_score": 42,
        "seo_score": 68,
        "accessibility_score": 55,
        "load_time_seconds": "7.2 s",
        "first_contentful_paint": "3.1 s",
        "largest_contentful_paint": "6.8 s",
        "total_blocking_time": "420 ms",
        "cumulative_layout_shift": "0.18",
        "_note": "Mock data — set PAGESPEED_API_KEY for real results"
    }
