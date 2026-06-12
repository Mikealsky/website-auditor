from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json as json_lib

from database import get_db
from models.audit import AuditRecord
from auth.firebase import require_user

router = APIRouter()


@router.get("/audits")
async def list_audits(
    user: dict = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AuditRecord)
        .where(AuditRecord.user_uid == user["uid"])
        .order_by(AuditRecord.created_at.desc())
        .limit(50)
    )
    rows = result.scalars().all()
    return {
        "success": True,
        "data": [
            {
                "id": r.id,
                "url": r.url,
                "business_name": r.business_name,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ],
    }


@router.get("/audits/{audit_id}")
async def get_audit(
    audit_id: str,
    user: dict = Depends(require_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AuditRecord).where(
            AuditRecord.id == audit_id,
            AuditRecord.user_uid == user["uid"],
        )
    )
    row = result.scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Audit not found")
    return {"success": True, "data": json_lib.loads(row.result_json)}
