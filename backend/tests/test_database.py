import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from database import Base
from models.audit import AuditRecord

TEST_DB = "sqlite+aiosqlite:///:memory:"

@pytest.fixture
async def session():
    engine = create_async_engine(TEST_DB)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    Session = async_sessionmaker(engine, expire_on_commit=False)
    async with Session() as s:
        yield s
    await engine.dispose()

@pytest.mark.asyncio
async def test_insert_and_fetch(session):
    record = AuditRecord(
        user_uid="uid_123",
        user_email="test@example.com",
        url="https://example.com",
        business_name="Example Co",
        result_json='{"performance": {}, "seo": {}, "ai_report": {}}',
    )
    session.add(record)
    await session.commit()

    result = await session.execute(select(AuditRecord).where(AuditRecord.user_uid == "uid_123"))
    row = result.scalar_one()
    assert row.url == "https://example.com"
    assert row.id is not None
    assert row.user_email == "test@example.com"
    assert row.result_json == '{"performance": {}, "seo": {}, "ai_report": {}}'
