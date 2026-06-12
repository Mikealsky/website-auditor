import pytest
from unittest.mock import patch, MagicMock
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def test_verify_token_invalid():
    """verify_token raises HTTPException for a garbage token."""
    with patch("auth.firebase._get_app", return_value=MagicMock()):
        with patch("firebase_admin.auth.verify_id_token", side_effect=Exception("bad token")):
            from auth.firebase import verify_token
            from fastapi import HTTPException
            with pytest.raises(HTTPException) as exc:
                verify_token("garbage")
            assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_optional_user_no_header():
    from auth.firebase import optional_user
    result = await optional_user(authorization=None)
    assert result is None


@pytest.mark.asyncio
async def test_optional_user_missing_bearer():
    from auth.firebase import optional_user
    result = await optional_user(authorization="Token abc123")
    assert result is None
