def test_register_success(client):
    response = client.post("/auth/register", json={
        "email": "newuser@test.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "newuser@test.com"
    assert data["user"]["role"] == "user"

def test_register_duplicate_email(client):
    client.post("/auth/register", json={
        "email": "duplicate@test.com",
        "password": "password123"
    })
    response = client.post("/auth/register", json={
        "email": "duplicate@test.com",
        "password": "password123"
    })
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_success(client):
    client.post("/auth/register", json={
        "email": "login@test.com",
        "password": "password123"
    })
    response = client.post("/auth/login", json={
        "email": "login@test.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_wrong_password(client):
    client.post("/auth/register", json={
        "email": "wrong@test.com",
        "password": "password123"
    })
    response = client.post("/auth/login", json={
        "email": "wrong@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_login_wrong_email(client):
    response = client.post("/auth/login", json={
        "email": "notexist@test.com",
        "password": "password123"
    })
    assert response.status_code == 401

def test_get_me(client, user_headers):
    response = client.get("/auth/me", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user@test.com"

def test_get_me_no_token(client):
    response = client.get("/auth/me")
    assert response.status_code == 401

def test_admin_role(client, admin_headers):
    response = client.get("/auth/me", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["role"] == "admin"