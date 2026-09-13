import pytest

from app import create_app
from app.extensions import db


class TestConfig:
    TESTING = True

    SECRET_KEY = "test-secret"

    JWT_SECRET_KEY = "test-jwt-secret"

    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CORS_ORIGINS = [
        "http://localhost:5173"
    ]


@pytest.fixture
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_health(client):
    response = client.get(
        "/api/health"
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert data["data"]["status"] == "ok"


def test_register(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["success"] is True
    assert "token" in data["data"]
    assert data["data"]["user"]["email"] == "test@example.com"


def test_login(client):
    client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert "token" in data["data"]


def test_duplicate_register(client):
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }

    first = client.post(
        "/api/auth/register",
        json=payload
    )

    second = client.post(
        "/api/auth/register",
        json=payload
    )

    assert first.status_code == 201
    assert second.status_code == 409
