from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.models.conquista import Conquista, UsuarioConquista
from datetime import datetime


def ensure_default_conquistas(db: Session):
    defaults = [
        {"chave": "primeiro_lembrete", "titulo": "Primeiro Lembrete", "descricao": "Criou o primeiro lembrete", "pontos": 10},
        {"chave": "primeira_simulacao", "titulo": "Primeira Simulação", "descricao": "Realizou a primeira simulação", "pontos": 5},
    ]
    try:
        for d in defaults:
            exist = db.query(Conquista).filter_by(chave=d["chave"]).first()
            if not exist:
                c = Conquista(chave=d["chave"], titulo=d["titulo"], descricao=d["descricao"], pontos=d["pontos"]) 
                db.add(c)
        db.commit()
    except Exception:
        # banco pode não estar disponível (dev fallback); não falhar aqui
        try:
            db.rollback()
        except Exception:
            pass


def conceder_conquista(db: Session, usuario_id: int, chave: str) -> bool:
    try:
        conquista = db.query(Conquista).filter_by(chave=chave).first()
        if not conquista:
            return False
    except Exception:
        return False
    # evitar duplicata
    existe = db.query(UsuarioConquista).filter_by(usuario_id=usuario_id, conquista_id=conquista.id).first()
    if existe:
        return False

    relation = UsuarioConquista(usuario_id=usuario_id, conquista_id=conquista.id, concedido_em=datetime.utcnow())
    try:
        db.add(relation)
        # atualizar pontos do usuário
        usuario = db.query(Usuario).filter_by(id=usuario_id).first()
        if usuario:
            usuario.pontos = (usuario.pontos or 0) + conquista.pontos
        db.commit()
        return True
    except Exception:
        try:
            db.rollback()
        except Exception:
            pass
        return False


def get_gamificacao(db: Session, usuario_id: int):
    try:
        usuario = db.query(Usuario).filter_by(id=usuario_id).first()
        if not usuario:
            # demo fallback
            return {"usuario_id": usuario_id, "pontos": 0, "conquistas": []}

        conquistas = (
            db.query(Conquista)
            .join(UsuarioConquista, UsuarioConquista.conquista_id == Conquista.id)
            .filter(UsuarioConquista.usuario_id == usuario_id)
            .all()
        )

        return {"usuario_id": usuario_id, "pontos": usuario.pontos or 0, "conquistas": conquistas}
    except Exception:
        # fallback demo if DB ops fail
        return {"usuario_id": usuario_id, "pontos": 0, "conquistas": []}
