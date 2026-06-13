from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.lembrete import Lembrete
from app.schemas.lembrete import LembreteCreate, LembreteRead
from app.services.gamificacao_service import conceder_conquista, ensure_default_conquistas

router = APIRouter()

@router.get("/", response_model=list[LembreteRead])
def listar_lembretes(db: Session = Depends(get_db)):
    lembretes = db.query(Lembrete).all()
    return [LembreteRead.from_orm(lembrete) for lembrete in lembretes]

@router.post("/", response_model=LembreteRead)
def criar_lembrete(lembrete: LembreteCreate, db: Session = Depends(get_db)):
    ensure_default_conquistas(db)
    novo = Lembrete(
        titulo=lembrete.titulo,
        descricao=lembrete.descricao,
        data_vencimento=lembrete.data_vencimento,
        categoria=lembrete.categoria,
        prioridade=lembrete.prioridade,
        concluido=0,
        usuario_id=1,
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    # conceder primeira conquista se aplicável
    try:
        conceder_conquista(db, 1, "primeiro_lembrete")
    except Exception:
        pass
    return LembreteRead.from_orm(novo)
