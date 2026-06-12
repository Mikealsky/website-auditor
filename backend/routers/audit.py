import json as json_lib
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel, HttpUrl
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from services.pagespeed import get_pagespeed_data
from services.scraper import scrape_seo_audit
from services.ai_report import generate_report
from services.pdf_export import generate_pdf
from auth.firebase import optional_user
from database import get_db
from models.audit import AuditRecord

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
async def run_audit(
    request: AuditRequest,
    user: Optional[dict] = Depends(optional_user),
    db: AsyncSession = Depends(get_db),
):
    url_str = str(request.url)

    try:
        performance = await get_pagespeed_data(url_str)
        seo = await scrape_seo_audit(url_str)
        raw_data = {"performance": performance, "seo": seo}
        ai_report = await generate_report(url_str, request.business_name, raw_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    result_data = {
        "url": url_str,
        "performance": performance,
        "seo": seo,
        "ai_report": ai_report,
    }

    if user:
        record = AuditRecord(
            user_uid=user["uid"],
            user_email=user.get("email", ""),
            url=url_str,
            business_name=request.business_name,
            result_json=json_lib.dumps(result_data),
        )
        db.add(record)
        await db.commit()
        result_data["audit_id"] = record.id

    return AuditResponse(success=True, data=result_data)


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
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="audit-{safe_name}.pdf"'},
    )
