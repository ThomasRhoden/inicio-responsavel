from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime


class Conquista(Base):
    __tablename__ = "conquistas"

    id = Column(Integer, primary_key=True, index=True)
    chave = Column(String(50), unique=True, nullable=False)
    titulo = Column(String(120), nullable=False)
    descricao = Column(Text, nullable=True)
    pontos = Column(Integer, nullable=False, default=0)
    criado_em = Column(DateTime, default=datetime.utcnow)


class UsuarioConquista(Base):
    __tablename__ = "usuario_conquistas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    conquista_id = Column(Integer, ForeignKey("conquistas.id"), nullable=False)
    concedido_em = Column(DateTime, default=datetime.utcnow)

    conquista = relationship("Conquista")
