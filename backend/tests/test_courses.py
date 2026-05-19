def test_create_course_as_admin(client, admin_headers):
    response = client.post("/courses/", json={
        "title": "Python Course",
        "description": "Learn Python",
        "price": 9.99
    }, headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Python Course"

def test_create_course_as_user_forbidden(client, user_headers):
    response = client.post("/courses/", json={
        "title": "Python Course",
        "description": "Learn Python",
        "price": 9.99
    }, headers=user_headers)
    assert response.status_code == 403

def test_list_courses(client, user_headers, admin_headers):
    client.post("/courses/", json={
        "title": "Course 1",
        "description": "Description 1",
        "price": 0
    }, headers=admin_headers)
    response = client.get("/courses/", headers=user_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_update_course_as_admin(client, admin_headers):
    create = client.post("/courses/", json={
        "title": "Old Title",
        "description": "Old Description",
        "price": 0
    }, headers=admin_headers)
    course_id = create.json()["id"]
    response = client.put(f"/courses/{course_id}", json={
        "title": "New Title"
    }, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"

def test_delete_course_as_admin(client, admin_headers):
    create = client.post("/courses/", json={
        "title": "Delete Me",
        "description": "Will be deleted",
        "price": 0
    }, headers=admin_headers)
    course_id = create.json()["id"]
    response = client.delete(
        f"/courses/{course_id}",
        headers=admin_headers
    )
    assert response.status_code == 200

def test_get_course_not_found(client, user_headers):
    response = client.get("/courses/9999", headers=user_headers)
    assert response.status_code == 404