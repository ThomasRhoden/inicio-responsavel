from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os
from sqlalchemy.exc import OperationalError
import sys

ROOT_DIR = Path(__file__).resolve().parents[3]
load_dotenv(ROOT_DIR / ".env")

DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = os.getenv("DB_PORT", "3306")
DB_NAME     = os.getenv("DB_NAME", "inicio_responsavel")
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_SQLITE = os.getenv("DB_SQLITE", "")

if DB_SQLITE:
    # Use a local sqlite file for development when DB_SQLITE is set
    DATABASE_URL = f"sqlite:///{DB_SQLITE}"
    engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
else:
    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
    )
    engine = create_engine(DATABASE_URL, echo=False)
    # testar conexão imediata e cair para sqlite se falhar
    try:
        conn = engine.connect()
        conn.close()
    except OperationalError:
        # fallback automático para sqlite dev
        fallback = ROOT_DIR / "backend" / "dev.sqlite3"
        DATABASE_URL = f"sqlite:///{fallback}"
        engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})
        print("[WARN] Não foi possível conectar ao MySQL; usando fallback SQLite:", str(fallback), file=sys.stderr)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

# Dependency para injetar sessão nas rotas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
