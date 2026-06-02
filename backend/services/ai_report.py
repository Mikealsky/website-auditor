import os
import httpx
import json

CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-6"


async def generate_report(url: str, business_name: str, audit_data: dict) -> dict:
    """
    Sends audit results to Claude and returns a plain-English report
    with prioritised recommendations for the business owner.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return _mock_report()

    prompt = _build_prompt(url, business_name, audit_data)

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    body = {
        "model": MODEL,
        "max_tokens": 1000,
        "system": (
            "You are a friendly web consultant helping small business owners improve their websites. "
            "Write in plain English — no technical jargon. The business owner is not a developer. "
            "Be direct, specific, and encouraging. Always explain WHY something matters in terms of "
            "customers and revenue, not just technical metrics."
        ),
        "messages": [{"role": "user", "content": prompt}],
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(CLAUDE_API_URL, headers=headers, json=body)
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPStatusError as e:
        error_detail = ""
        try:
            error_detail = e.response.json().get("error", {}).get("message", "")
        except Exception:
            pass
        return {"summary": f"AI report unavailable: {error_detail or str(e)}", "model": MODEL, "error": True}
    except httpx.RequestError as e:
        return {"summary": f"AI report unavailable: could not reach Anthropic API ({e})", "model": MODEL, "error": True}

    report_text = data["content"][0]["text"]

    return {
        "summary": report_text,
        "model": MODEL,
    }


def _build_prompt(url: str, business_name: str, audit_data: dict) -> str:
    perf = audit_data.get("performance", {})
    seo = audit_data.get("seo", {})

    issues = []

    if perf.get("performance_score", 100) < 50:
        issues.append(f"Very slow load time ({perf.get('load_time_seconds', 'unknown')} on mobile)")
    if not seo.get("has_meta_description", {}).get("present", True):
        issues.append("Missing meta description (invisible to Google search results)")
    if seo.get("images_missing_alt", 0) > 0:
        issues.append(f"{seo['images_missing_alt']} images have no alt text (hurts SEO and accessibility)")
    if not seo.get("has_https", True):
        issues.append("Site is not secure (no HTTPS) — browsers warn visitors about this")
    if not seo.get("has_phone_number", True):
        issues.append("No phone number visible on the page")
    if not seo.get("has_cta_above_fold", True):
        issues.append("No clear call-to-action visible")
    if seo.get("h1_count", 1) == 0:
        issues.append("No main heading (H1) — Google can't understand what the page is about")

    issues_text = "\n".join(f"- {i}" for i in issues) if issues else "- No major issues found"

    return f"""
I have audited the website for {business_name} at {url}.

Here are the key findings:

Performance scores (out of 100):
- Overall performance: {perf.get('performance_score', 'N/A')}
- SEO score: {perf.get('seo_score', 'N/A')}
- Accessibility score: {perf.get('accessibility_score', 'N/A')}

Key issues identified:
{issues_text}

Please write:
1. A 2-3 sentence plain-English summary of the website's overall health
2. A numbered list of the 5 most important improvements, ordered by impact
3. For each improvement, explain what it is, why it matters to customers, and one concrete action to fix it

Keep the tone friendly and encouraging — the goal is to help them, not overwhelm them.
""".strip()


def _mock_report() -> dict:
    return {
        "summary": (
            "Mock report — set ANTHROPIC_API_KEY in your .env file to generate real AI reports. "
            "Once connected, Claude will analyse your audit results and produce plain-English "
            "recommendations tailored to your business."
        ),
        "model": "mock",
    }
