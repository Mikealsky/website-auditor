import os
import re
import json
import httpx

# Emoji ranges — used to strip any that slip through despite prompt instructions
_EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001F5FF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U0001F900-\U0001F9FF"
    "\U0001FA00-\U0001FAFF"
    "\U00002600-\U000027BF"
    "\U0001F1E0-\U0001F1FF"
    "︀-️"
    "]+",
    flags=re.UNICODE,
)


def _clean(text: str) -> str:
    """Remove emojis and normalise dashes in AI-generated text."""
    text = _EMOJI_RE.sub("", text)
    text = text.replace("—", " - ").replace("–", " - ")  # em/en dash
    text = re.sub(r"-{2,}", " - ", text)                           # -- or longer
    text = re.sub(r"  +", " ", text).strip()
    return text

CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-6"


async def generate_report(url: str, business_name: str, audit_data: dict) -> dict:
    """
    Sends audit results to Claude and returns a structured report with a
    plain-English summary and a prioritised recommendations list.
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
        "max_tokens": 1024,
        "system": (
            "You are a friendly web consultant helping small business owners improve their websites. "
            "Write in plain English — no technical jargon. The business owner is not a developer. "
            "Be direct, specific, and encouraging. Explain why each issue matters in terms of "
            "customers and revenue, not technical metrics. "
            "Do not use emojis anywhere in your response. "
            "Do not use dashes (hyphens used as dashes), em dashes, or double hyphens. "
            "Use commas, colons, or full stops instead. "
            "Always respond with valid JSON exactly as instructed — no markdown fences, no extra text."
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
        return {"summary": f"AI report unavailable: {error_detail or str(e)}", "recommendations": [], "model": MODEL, "error": True}
    except httpx.RequestError as e:
        return {"summary": f"AI report unavailable: could not reach Anthropic API ({e})", "recommendations": [], "model": MODEL, "error": True}

    report_text = data["content"][0]["text"].strip()

    # Strip accidental markdown fences
    if report_text.startswith("```"):
        report_text = re.sub(r'^```(?:json)?\n?', '', report_text)
        report_text = re.sub(r'\n?```$', '', report_text.strip())

    try:
        parsed = json.loads(report_text)
        recs = [
            {
                "title": _clean(str(r.get("title", ""))),
                "body": _clean(str(r.get("body", ""))),
                "priority": str(r.get("priority", "Medium")),
            }
            for r in parsed.get("recommendations", [])
        ]
        return {
            "summary": _clean(parsed.get("summary", "")),
            "recommendations": recs,
            "model": MODEL,
        }
    except (json.JSONDecodeError, KeyError):
        return {
            "summary": _clean(report_text),
            "recommendations": [],
            "model": MODEL,
        }


def _build_prompt(url: str, business_name: str, audit_data: dict) -> str:
    perf = audit_data.get("performance", {})
    seo = audit_data.get("seo", {})

    issues = []
    if perf.get("performance_score", 100) < 50:
        issues.append(f"Very slow load time ({perf.get('load_time_seconds', 'unknown')}s on mobile)")
    if not seo.get("has_meta_description", {}).get("present", True):
        issues.append("Missing meta description (invisible in Google search results)")
    if seo.get("images_missing_alt", 0) > 0:
        issues.append(f"{seo['images_missing_alt']} images have no alt text (hurts SEO and accessibility)")
    if not seo.get("has_https", True):
        issues.append("Site is not secure (no HTTPS) — browsers warn visitors away")
    if not seo.get("has_phone_number", True):
        issues.append("No phone number visible on the page")
    if not seo.get("has_cta_above_fold", True):
        issues.append("No clear call-to-action visible above the fold")
    if seo.get("h1_count", 1) == 0:
        issues.append("No main heading (H1) — Google can't tell what the page is about")

    issues_text = "\n".join(f"- {i}" for i in issues) if issues else "- No major issues found"

    return f"""Audit results for {business_name} ({url}):

Scores (out of 100): Performance {perf.get('performance_score', 'N/A')} | SEO {perf.get('seo_score', 'N/A')} | Accessibility {perf.get('accessibility_score', 'N/A')}
Load time: {perf.get('load_time_seconds', 'N/A')}s

Issues found:
{issues_text}

Respond with valid JSON only — no markdown, no text outside the JSON object:
{{
  "summary": "2-3 sentences of plain-English overview for the business owner. Name the most urgent problem specifically. No jargon.",
  "recommendations": [
    {{
      "title": "Short action title (max 8 words)",
      "body": "1-2 sentences on what this is and why it costs them customers or revenue.",
      "priority": "High"
    }}
  ]
}}

Return 3-6 recommendations ordered by customer impact. priority must be exactly High, Medium, or Low. High means it is costing them customers right now."""


def _mock_report() -> dict:
    return {
        "summary": (
            "Mock report — add your ANTHROPIC_API_KEY to backend/.env to generate real AI reports. "
            "Claude will analyse the audit results and write plain-English recommendations tailored to this business."
        ),
        "recommendations": [],
        "model": "mock",
    }
