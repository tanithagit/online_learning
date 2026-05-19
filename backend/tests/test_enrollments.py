def create_course(client, admin_headers, title="Test Course"):
    response = client.post("/courses/", json={
        "title": title,
        "description": "Test",
        "price": 0
    }, headers=admin_headers)
    return response.json()["id"]

def test_enroll_success(client, user_headers, admin_headers):
    course_id = create_course(client, admin_headers)
    response = client.post("/enrollments/", json={
        "course_id": course_id
    }, headers=user_headers)
    assert response.status_code == 200
    assert response.json()["course_id"] == course_id

def test_enroll_duplicate(client, user_headers, admin_headers):
    course_id = create_course(client, admin_headers)
    client.post("/enrollments/", json={
        "course_id": course_id
    }, headers=user_headers)
    response = client.post("/enrollments/", json={
        "course_id": course_id
    }, headers=user_headers)
    assert response.status_code == 400
    assert "Already enrolled" in response.json()["detail"]

def test_free_plan_limit(client, user_headers, admin_headers):
    # Create 3 courses
    course1 = create_course(client, admin_headers, "Course 1")
    course2 = create_course(client, admin_headers, "Course 2")
    course3 = create_course(client, admin_headers, "Course 3")

    # Enroll in first 2 - should work
    r1 = client.post("/enrollments/", json={
        "course_id": course1
    }, headers=user_headers)
    assert r1.status_code == 200

    r2 = client.post("/enrollments/", json={
        "course_id": course2
    }, headers=user_headers)
    assert r2.status_code == 200

    # Third enrollment - should fail for free plan
    r3 = client.post("/enrollments/", json={
        "course_id": course3
    }, headers=user_headers)
    assert r3.status_code == 403
    assert "Free plan" in r3.json()["detail"]

def test_get_my_enrollments(client, user_headers, admin_headers):
    course_id = create_course(client, admin_headers)
    client.post("/enrollments/", json={
        "course_id": course_id
    }, headers=user_headers)
    response = client.get("/enrollments/my", headers=user_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_unenroll(client, user_headers, admin_headers):
    course_id = create_course(client, admin_headers)
    enroll = client.post("/enrollments/", json={
        "course_id": course_id
    }, headers=user_headers)
    enrollment_id = enroll.json()["id"]
    response = client.delete(
        f"/enrollments/{enrollment_id}",
        headers=user_headers
    )
    assert response.status_code == 200