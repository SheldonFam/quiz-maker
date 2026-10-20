import random
from datetime import UTC, datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlmodel import create_engine

from config import settings
from models import (
    CurriculumPublic,
    LevelPublic,
    Message,
    QuestionCreate,
    QuestionGenerateRequest,
    QuestionPublic,
    QuizCreate,
    QuizGenerateRequest,
    QuizPublic,
    QuizUpdate,
    QuizzesPublic,
    SubjectPublic,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine(settings.database_url)

fake_quizzes: dict[int, QuizPublic] = {}

fake_curriculum = CurriculumPublic(
    data=[
        LevelPublic(
            name="Tahun 4",
            curriculum="KSSR",
            subjects=[
                SubjectPublic(
                    name="Matematik",
                    topics=[
                        "Nombor Bulat dan Operasi",
                        "Pecahan, Perpuluhan dan Peratus",
                        "Wang",
                    ],
                ),
                SubjectPublic(
                    name="Sains",
                    topics=["Manusia", "Haiwan", "Tumbuhan"],
                ),
            ],
        ),
        LevelPublic(
            name="Tahun 5",
            curriculum="KSSR",
            subjects=[
                SubjectPublic(
                    name="Matematik",
                    topics=[
                        "Nombor Bulat dan Operasi",
                        "Pecahan, Perpuluhan dan Peratus",
                        "Masa dan Waktu",
                    ],
                ),
            ],
        ),
    ]
)


def make_quiz_public(
    quiz_id: int, quiz: QuizCreate | QuizUpdate, created_at: datetime
) -> QuizPublic:
    questions = []
    for position, question in enumerate(quiz.questions, start=1):
        questions.append(QuestionPublic(id=position, **question.model_dump()))
    return QuizPublic(
        id=quiz_id,
        title=quiz.title,
        level=quiz.level,
        subject=quiz.subject,
        topic=quiz.topic,
        language=quiz.language,
        questions=questions,
        created_at=created_at,
    )


def get_quiz_or_404(quiz_id: int) -> QuizPublic:
    quiz = fake_quizzes.get(quiz_id)
    if quiz is None:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


@app.get("/")
def read_root():
    return {"message": "Quiz Maker API"}


@app.get("/health")
def read_health():
    return {"status": "ok"}


@app.get("/health/database")
def read_database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        return {"database": "ok"}


@app.post("/quizzes/generate", response_model=QuizCreate)
def generate_quiz(request: QuizGenerateRequest):
    questions = []
    for number in range(1, request.question_count + 1):
        answer = number + number
        questions.append(
            QuestionCreate(
                text=f"What is {number} + {number}?",
                options=[
                    str(answer),
                    str(answer + 1),
                    str(answer + 2),
                    str(answer + 3),
                ],
                correct_index=0,
                explanation=f"{number} + {number} = {answer}.",
            )
        )
    return QuizCreate(
        title=f"{request.topic} quiz",
        level=request.level,
        subject=request.subject,
        topic=request.topic,
        language=request.language,
        questions=questions,
    )


@app.get("/quizzes", response_model=QuizzesPublic)
def read_quizzes(search: str | None = None, level: str | None = None):
    quizzes = []
    for quiz in fake_quizzes.values():
        if level is not None and quiz.level != level:
            continue
        if search is not None:
            search_lower = search.lower()
            in_title = search_lower in quiz.title.lower()
            in_topic = search_lower in quiz.topic.lower()
            if not in_title and not in_topic:
                continue
        quizzes.append(quiz)
    return QuizzesPublic(data=quizzes, count=len(quizzes))


@app.post("/questions/generate", response_model=QuestionCreate)
def generate_question(request: QuestionGenerateRequest):
    number = random.randint(1, 50)
    answer = number + number
    return QuestionCreate(
        text=f"What is {number} + {number}?",
        options=[str(answer), str(answer + 1), str(answer + 2), str(answer + 3)],
        correct_index=0,
        explanation=f"{number} + {number} = {answer}.",
    )


@app.get("/quizzes/{quiz_id}", response_model=QuizPublic)
def read_quiz(quiz_id: int):
    return get_quiz_or_404(quiz_id)


@app.post("/quizzes", response_model=QuizPublic, status_code=201)
def create_quiz(quiz: QuizCreate):
    quiz_id = max(fake_quizzes, default=0) + 1
    created_at = datetime.now(UTC)
    quiz_public = make_quiz_public(quiz_id, quiz, created_at)
    fake_quizzes[quiz_id] = quiz_public
    return quiz_public


@app.put("/quizzes/{quiz_id}", response_model=QuizPublic)
def update_quiz(quiz_id: int, quiz: QuizUpdate):
    existing_quiz = get_quiz_or_404(quiz_id)
    quiz_public = make_quiz_public(quiz_id, quiz, existing_quiz.created_at)
    fake_quizzes[quiz_id] = quiz_public
    return quiz_public


@app.delete("/quizzes/{quiz_id}", response_model=Message)
def delete_quiz(quiz_id: int):
    get_quiz_or_404(quiz_id)
    del fake_quizzes[quiz_id]
    return Message(message="Quiz deleted successfully")


@app.get("/curriculum", response_model=CurriculumPublic)
def read_curriculum():
    return fake_curriculum
