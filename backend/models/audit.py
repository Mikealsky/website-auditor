from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
from datetime import datetime
import uuid


class AuditRecord(Base):
    __tablename__ = "audits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_uid: Mapped[str] = mapped_column(String(128), index=True)
    user_email: Mapped[str] = mapped_column(String(256))
    url: Mapped[str] = mapped_column(String(2048))
    business_name: Mapped[str] = mapped_column(String(256))
    result_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
