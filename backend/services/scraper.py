import ipaddress
import socket
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup


_BLOCKED_RANGES = [
    ipaddress.ip_network("127.0.0.0/8"),     # loopback
    ipaddress.ip_network("10.0.0.0/8"),       # RFC-1918 private
    ipaddress.ip_network("172.16.0.0/12"),    # RFC-1918 private
    ipaddress.ip_network("192.168.0.0/16"),   # RFC-1918 private
    ipaddress.ip_network("169.254.0.0/16"),   # link-local / cloud metadata (AWS, GCP, Azure)
    ipaddress.ip_network("100.64.0.0/10"),    # shared address space
    ipaddress.ip_network("::1/128"),           # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),          # IPv6 unique local
    ipaddress.ip_network("fe80::/10"),         # IPv6 link-local
]


def _assert_safe_url(url: str) -> None:
    """
    Resolves the URL's hostname to IP addresses and raises ValueError if any
    resolve to a private, loopback, or cloud-metadata range.
    Must be called for every URL before fetching, including redirect destinations.
    """
    host = urlparse(url).hostname
    if not host:
        raise ValueError("Could not parse hostname from URL")

    try:
        results = socket.getaddrinfo(host, None)
    except socket.gaierror as e:
        raise ValueError(f"Could not resolve hostname '{host}': {e}")

    for (_family, _type, _proto, _canonname, sockaddr) in results:
        addr = sockaddr[0]
        try:
            ip = ipaddress.ip_address(addr)
        except ValueError:
            continue
        for blocked in _BLOCKED_RANGES:
            if ip in blocked:
                raise ValueError(
                    f"'{host}' resolves to {ip}, which is in a blocked address range"
                )


async def scrape_seo_audit(url: str) -> dict:
    """
    Fetches the page HTML and checks for common SEO and UX issues.
    Returns a structured dict of findings.
    """
    # SSRF protection: validate before any network I/O
    try:
        _assert_safe_url(url)
    except ValueError as e:
        return {"error": f"URL not allowed: {e}"}

    try:
        # follow_redirects=False so we can re-validate every redirect destination
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=False) as client:
            headers = {"User-Agent": "Mozilla/5.0 (compatible; WebAuditor/1.0)"}
            response = await client.get(url, headers=headers)

            for _ in range(5):
                if not response.is_redirect:
                    break
                next_req = response.next_request
                if next_req is None:
                    break
                # Re-validate the redirect destination before following
                _assert_safe_url(str(next_req.url))
                response = await client.send(next_req)

            response.raise_for_status()
            html = response.text

    except ValueError as e:
        return {"error": f"URL not allowed: {e}"}
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
    import re
    text = soup.get_text()
    phone_pattern = re.compile(r"(\+?\d[\d\s\-().]{7,}\d)")
    return bool(phone_pattern.search(text))


def _check_viewport(soup: BeautifulSoup) -> bool:
    tag = soup.find("meta", attrs={"name": "viewport"})
    return tag is not None


def _check_cta(soup: BeautifulSoup) -> bool:
    cta_phrases = ["contact us", "get a quote", "book now", "call us", "get started",
                   "learn more", "sign up", "buy now", "order now", "request a"]
    text = soup.get_text().lower()
    return any(phrase in text for phrase in cta_phrases)
