from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from services.pagespeed import get_pagespeed_data
from services.scraper import scrape_seo_audit
from services.ai_report import generate_report

router = APIRouter()


class AuditRequest(BaseModel):
    url: HttpUrl
    business_name: str = "this business"


class AuditResponse(BaseModel):
    success: bool
    data: dict
    error: str | None = None


@router.post("/audit", response_model=AuditResponse)
async def run_audit(request: AuditRequest):
    url_str = str(request.url)

    try:
        # Step 1: Performance audit via PageSpeed API
        performance = await get_pagespeed_data(url_str)

        # Step 2: SEO + design audit via scraper
        seo = await scrape_seo_audit(url_str)

        # Step 3: Combine results and generate AI report
        raw_data = {"performance": performance, "seo": seo}
        ai_report = await generate_report(url_str, request.business_name, raw_data)

        return AuditResponse(
            success=True,
            data={
                "url": url_str,
                "performance": performance,
                "seo": seo,
                "ai_report": ai_report,
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
