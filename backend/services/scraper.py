import httpx
from bs4 import BeautifulSoup


async def scrape_seo_audit(url: str) -> dict:
    """
    Fetches the page HTML and checks for common SEO and UX issues.
    Returns a structured dict of findings.
    """
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            headers = {"User-Agent": "Mozilla/5.0 (compatible; WebAuditor/1.0)"}
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            html = response.text
    except Exception as e:
        return {"error": f"Could not fetch page: {str(e)}"}

    soup = BeautifulSoup(html, "html.parser")

    return {
        "has_title": _check_title(soup),
        "has_meta_description": _check_meta_description(soup),
        "has_h1": _check_h1(soup),
        "h1_count": len(soup.find_all("h1")),
        "images_missing_alt": _count_images_missing_alt(soup),
        "total_images": len(soup.find_all("img")),
        "has_phone_number": _check_phone_number(soup),
        "has_https": url.startswith("https://"),
        "has_viewport_meta": _check_viewport(soup),
        "has_cta_above_fold": _check_cta(soup),
        "internal_links": len([a for a in soup.find_all("a", href=True) if not a["href"].startswith("http")]),
        "external_links": len([a for a in soup.find_all("a", href=True) if a["href"].startswith("http")]),
        "word_count": len(soup.get_text().split()),
    }


def _check_title(soup: BeautifulSoup) -> dict:
    tag = soup.find("title")
    text = tag.get_text(strip=True) if tag else ""
    return {"present": bool(text), "value": text, "length": len(text)}


def _check_meta_description(soup: BeautifulSoup) -> dict:
    tag = soup.find("meta", attrs={"name": "description"})
    content = tag.get("content", "").strip() if tag else ""
    return {"present": bool(content), "value": content, "length": len(content)}


def _check_h1(soup: BeautifulSoup) -> bool:
    return soup.find("h1") is not None


def _count_images_missing_alt(soup: BeautifulSoup) -> int:
    return sum(1 for img in soup.find_all("img") if not img.get("alt", "").strip())


def _check_phone_number(soup: BeautifulSoup) -> bool:
    text = soup.get_text()
    import re
    phone_pattern = re.compile(r"(\+?\d[\d\s\-().]{7,}\d)")
    return bool(phone_pattern.search(text))


def _check_viewport(soup: BeautifulSoup) -> bool:
    tag = soup.find("meta", attrs={"name": "viewport"})
    return tag is not None


def _check_cta(soup: BeautifulSoup) -> bool:
    """Rough heuristic: checks if common CTA phrases exist anywhere on the page."""
    cta_phrases = ["contact us", "get a quote", "book now", "call us", "get started",
                   "learn more", "sign up", "buy now", "order now", "request a"]
    text = soup.get_text().lower()
    return any(phrase in text for phrase in cta_phrases)
