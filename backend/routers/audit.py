from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, HttpUrl
from services.pagespeed import get_pagespeed_data
from services.scraper import scrape_seo_audit
from services.ai_report import generate_report
from services.pdf_export import generate_pdf

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
    filename = f"audit-{safe_name}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
