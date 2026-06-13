from sqlalchemy import Column, Integer, String, Enum, DECIMAL, DateTime, func

from ..core.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    senha_hash = Column(String(255), nullable=False)
    situacao_atual = Column(
        Enum('DESEMPREGADO', 'ESTAGIARIO', 'MENOR_APRENDIZ', 'CLT', 'PJ', 'MEI', 'ME', 'SIMPLES_NACIONAL', name='situacao_atual_enum'),
        nullable=False,
        default='DESEMPREGADO',
    )
    nivel_atual = Column(Integer, nullable=False, default=0)
    renda_mensal = Column(DECIMAL(10, 2), nullable=True)
    area_interesse = Column(String(100), nullable=True)
    pontos = Column(Integer, nullable=False, default=0)
    ativo = Column(Integer, nullable=False, default=1)
    criado_em = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    atualizado_em = Column(DateTime, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
