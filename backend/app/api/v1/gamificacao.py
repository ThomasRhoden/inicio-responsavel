from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.gamificacao_service import get_gamificacao, ensure_default_conquistas, conceder_conquista
from app.schemas.gamificacao import GamificacaoRead

router = APIRouter()


@router.on_event("startup")
def _init_defaults():
    # ensure default conquistas when app starts (silently ignore errors)
    try:
        db = next(get_db())
        ensure_default_conquistas(db)
    except Exception:
        pass


@router.get("/{usuario_id}", response_model=GamificacaoRead)
def obter_gamificacao(usuario_id: int, db: Session = Depends(get_db)):
    data = get_gamificacao(db, usuario_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return data


@router.post("/{usuario_id}/conceder/{chave}")
def conceder(usuario_id: int, chave: str, db: Session = Depends(get_db)):
    ok = conceder_conquista(db, usuario_id, chave)
    if not ok:
        raise HTTPException(status_code=400, detail="Conquista não encontrada ou já concedida")
    return {"status": "ok"}
