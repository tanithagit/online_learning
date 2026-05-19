import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from main import app

# Use SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_user(client):
    response = client.post("/auth/register", json={
        "email": "user@test.com",
        "password": "test123"
    })
    return response.json()

@pytest.fixture
def test_admin(client):
    from app.models.user import UserRole
    from tests.conftest import TestingSessionLocal
    response = client.post("/auth/register", json={
        "email": "admin@test.com",
        "password": "admin123"
    })
    db = TestingSessionLocal()
    from app.models.user import User
    user = db.query(User).filter(
        User.email == "admin@test.com"
    ).first()
    user.role = UserRole.admin
    db.commit()
    db.close()
    login = client.post("/auth/login", json={
        "email": "admin@test.com",
        "password": "admin123"
    })
    return login.json()

@pytest.fixture
def user_headers(test_user):
    return {
        "Authorization": f"Bearer {test_user['access_token']}"
    }

@pytest.fixture
def admin_headers(test_admin):
    return {
        "Authorization": f"Bearer {test_admin['access_token']}"
    }