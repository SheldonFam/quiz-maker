from fastapi import FastAPI
from sqlalchemy import text
from sqlmodel import create_engine

from config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

engine = create_engine(settings.database_url)


@app.get("/health")
def read_health():
    return {"status": "ok"}


@app.get("/")
def read_root():
    return {"message":"Quiz make API"}

@app.get('/health/database')
def read_database_health():
    with engine.connect()as connection:
        connection.execute(text("SELECT 1"))
        return {"database":"ok"}
