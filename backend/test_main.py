import pytest
from fastapi.testclient import TestClient

from main import app, fake_quizzes

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_fake_quizzes():
    fake_quizzes.clear()


def make_generate_request(level="Tahun 4", topic="Pecahan", question_count=3):
    return {
        "level": level,
        "subject": "Matematik",
        "topic": topic,
        "language": "ms",
        "question_count": question_count,
    }


def create_saved_quiz(level="Tahun 4", topic="Pecahan"):
    request = make_generate_request(level=level, topic=topic)
    generated_quiz = client.post("/quizzes/generate", json=request).json()
    response = client.post("/quizzes", json=generated_quiz)
    return response.json()


def test_read_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_read_curriculum():
    response = client.get("/curriculum")
    assert response.status_code == 200
    first_level = response.json()["data"][0]
    assert first_level["name"] == "Tahun 4"
    assert len(first_level["subjects"]) > 0


def test_generate_quiz_returns_requested_number_of_questions():
    request = make_generate_request(question_count=5)
    response = client.post("/quizzes/generate", json=request)
    assert response.status_code == 200
    quiz = response.json()
    assert len(quiz["questions"]) == 5
    assert len(quiz["questions"][0]["options"]) == 4


def test_generate_quiz_rejects_unknown_language():
    request = make_generate_request()
    request["language"] = "zh"
    response = client.post("/quizzes/generate", json=request)
    assert response.status_code == 422


def test_generate_quiz_rejects_too_many_questions():
    request = make_generate_request(question_count=21)
    response = client.post("/quizzes/generate", json=request)
    assert response.status_code == 422


def test_generate_question_returns_one_question():
    request = make_generate_request()
    del request["question_count"]
    response = client.post("/questions/generate", json=request)
    assert response.status_code == 200
    question = response.json()
    assert "text" in question
    assert len(question["options"]) == 4


def test_create_quiz():
    quiz = create_saved_quiz()
    assert quiz["id"] == 1
    assert quiz["questions"][0]["id"] == 1
    assert "created_at" in quiz


def test_read_quizzes_when_empty():
    response = client.get("/quizzes")
    assert response.status_code == 200
    assert response.json() == {"data": [], "count": 0}


def test_read_quizzes_with_filters():
    create_saved_quiz(level="Tahun 4", topic="Pecahan")
    create_saved_quiz(level="Tahun 4", topic="Wang")
    create_saved_quiz(level="Tahun 5", topic="Pecahan")

    assert client.get("/quizzes").json()["count"] == 3
    assert client.get("/quizzes", params={"level": "Tahun 4"}).json()["count"] == 2
    assert client.get("/quizzes", params={"search": "pecahan"}).json()["count"] == 2
    both_filters = {"search": "pecahan", "level": "Tahun 4"}
    assert client.get("/quizzes", params=both_filters).json()["count"] == 1
    assert client.get("/quizzes", params={"search": "xyz"}).json()["count"] == 0


def test_read_quiz():
    quiz = create_saved_quiz()
    response = client.get(f"/quizzes/{quiz['id']}")
    assert response.status_code == 200
    assert response.json()["topic"] == "Pecahan"


def test_read_quiz_not_found():
    response = client.get("/quizzes/99")
    assert response.status_code == 404
    assert response.json() == {"detail": "Quiz not found"}


def test_update_quiz_keeps_created_at():
    quiz = create_saved_quiz()
    quiz["title"] = "Edited title"
    response = client.put(f"/quizzes/{quiz['id']}", json=quiz)
    assert response.status_code == 200
    assert response.json()["title"] == "Edited title"
    assert response.json()["created_at"] == quiz["created_at"]


def test_delete_quiz():
    quiz = create_saved_quiz()
    response = client.delete(f"/quizzes/{quiz['id']}")
    assert response.status_code == 200
    assert response.json() == {"message": "Quiz deleted successfully"}
    assert client.get(f"/quizzes/{quiz['id']}").status_code == 404


def test_generate_quiz_rejects_zero_questions():
    request = make_generate_request(question_count=0)
    response = client.post("/quizzes/generate", json=request)
    assert response.status_code == 422


def test_generate_quiz_rejects_missing_topic():
    request = make_generate_request()
    del request["topic"]
    response = client.post("/quizzes/generate", json=request)
    assert response.status_code == 422


def test_generate_question_rejects_unknown_language():
    request = make_generate_request()
    del request["question_count"]
    request["language"] = "zh"
    response = client.post("/questions/generate", json=request)
    assert response.status_code == 422


def test_create_quiz_rejects_three_options():
    request = make_generate_request()
    quiz = client.post("/quizzes/generate", json=request).json()
    quiz["questions"][0]["options"] = ["1", "2", "3"]
    response = client.post("/quizzes", json=quiz)
    assert response.status_code == 422


def test_create_quiz_rejects_correct_index_out_of_range():
    request = make_generate_request()
    quiz = client.post("/quizzes/generate", json=request).json()
    quiz["questions"][0]["correct_index"] = 4
    response = client.post("/quizzes", json=quiz)
    assert response.status_code == 422


def test_create_quiz_rejects_empty_title():
    request = make_generate_request()
    quiz = client.post("/quizzes/generate", json=request).json()
    quiz["title"] = ""
    response = client.post("/quizzes", json=quiz)
    assert response.status_code == 422


def test_update_quiz_not_found():
    request = make_generate_request()
    quiz = client.post("/quizzes/generate", json=request).json()
    response = client.put("/quizzes/99", json=quiz)
    assert response.status_code == 404


def test_delete_quiz_not_found():
    response = client.delete("/quizzes/99")
    assert response.status_code == 404


def test_create_quiz_rejects_no_questions():
    request = make_generate_request()
    quiz = client.post("/quizzes/generate", json=request).json()
    quiz["questions"] = []
    response = client.post("/quizzes", json=quiz)
    assert response.status_code == 422
