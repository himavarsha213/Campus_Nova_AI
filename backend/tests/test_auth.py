import pytest
from app.core.security import get_password_hash, verify_password, create_access_token

def test_password_hashing():
    pwd = "CampusNovaSecretPassword2026!"
    hashed = get_password_hash(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_generation():
    token = create_access_token(subject="user-123", role="student")
    assert isinstance(token, str)
    assert len(token) > 20
