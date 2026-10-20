from datetime import datetime
from typing import Literal

from sqlmodel import Field, SQLModel

Language = Literal["en", "ms"]


class GenerateBase(SQLModel):
    level: str = Field(min_length=1, max_length=100)
    subject: str = Field(min_length=1, max_length=100)
    topic: str = Field(min_length=1, max_length=255)
    language: Language


class QuizGenerateRequest(GenerateBase):
    question_count: int = Field(ge=1, le=20)


class QuestionGenerateRequest(GenerateBase):
    pass


class QuestionBase(SQLModel):
    text: str = Field(min_length=1)
    options: list[str] = Field(min_length=4, max_length=4)
    correct_index: int = Field(ge=0, le=3)
    explanation: str = Field(min_length=1)


class QuestionCreate(QuestionBase):
    pass


class QuestionPublic(QuestionBase):
    id: int


class QuizBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    level: str = Field(min_length=1, max_length=100)
    subject: str = Field(min_length=1, max_length=100)
    topic: str = Field(min_length=1, max_length=255)
    language: Language


class QuizCreate(QuizBase):
    questions: list[QuestionCreate]


class QuizUpdate(QuizBase):
    questions: list[QuestionCreate]


class QuizPublic(QuizBase):
    id: int
    created_at: datetime
    questions: list[QuestionPublic]


class QuizzesPublic(SQLModel):
    data: list[QuizPublic]
    count: int


class Message(SQLModel):
    message: str


class SubjectPublic(SQLModel):
    name: str
    topics: list[str]


class LevelPublic(SQLModel):
    name: str
    curriculum: str
    subjects: list[SubjectPublic]


class CurriculumPublic(SQLModel):
    data: list[LevelPublic]
