from bcrypt import gensalt, hashpw
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioRead

router = APIRouter()

@router.post("/", response_model=UsuarioRead)
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    senha_hash = hashpw(usuario.senha.encode("utf-8"), gensalt()).decode("utf-8")
    novo_usuario = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=senha_hash,
        situacao_atual=usuario.situacao_atual or "DESEMPREGADO",
        renda_mensal=usuario.renda_mensal,
        area_interesse=usuario.area_interesse,
    )
    db.add(novo_usuario)
    try:
        db.commit()
        db.refresh(novo_usuario)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    return UsuarioRead.from_orm(novo_usuario)

@router.get("/{usuario_id}", response_model=UsuarioRead)
def obter_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return UsuarioRead.from_orm(usuario)
