"""Aplicador simples de migrações SQL do diretório sql/migrations.

Uso: python migrate.py
Ele lê as variáveis de conexão do mesmo .env do projeto e aplica cada arquivo .sql em ordem alfabética.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import sqlalchemy


ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "inicio_responsavel")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"


def apply_migrations():
    # support sqlite dev fallback via DB_SQLITE env
    db_sqlite = os.getenv("DB_SQLITE", "")
    if db_sqlite:
        engine = sqlalchemy.create_engine(f"sqlite:///{db_sqlite}", connect_args={"check_same_thread": False})
        print("Usando SQLite em:", db_sqlite)
        # garantir que o pacote 'app' esteja importável
        try:
            import sys
            from pathlib import Path
            import importlib
            ROOT = Path(__file__).resolve().parents[2]
            sys.path.insert(0, str(ROOT / "backend"))
            # importar todos os modelos para que Base.metadata conheça-os
            models_dir = ROOT / "backend" / "app" / "models"
            for p in models_dir.glob("*.py"):
                if p.name.startswith("__"):
                    continue
                mod_name = f"app.models.{p.stem}"
                try:
                    importlib.import_module(mod_name)
                except Exception:
                    pass
            from app.core.database import Base
            Base.metadata.create_all(engine)
            print("Tabelas criadas via SQLAlchemy Base.metadata.create_all")
        except Exception as e:
            print("Erro criando tabelas via SQLAlchemy:", e)
        return

    engine = sqlalchemy.create_engine(URL)
    migrations_dir = ROOT / "sql" / "migrations"
    sql_files = sorted(migrations_dir.glob("*.sql"))
    if not sql_files:
        print("Nenhuma migração encontrada.")
        return

    with engine.connect() as conn:
        for f in sql_files:
            print("Aplicando:", f.name)
            sql = f.read_text(encoding="utf-8")
            try:
                conn.execute(sqlalchemy.text(sql))
                conn.commit()
            except Exception as e:
                print("Erro ao aplicar", f.name, e)
                break


if __name__ == "__main__":
    apply_migrations()
