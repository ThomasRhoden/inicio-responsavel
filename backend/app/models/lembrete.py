from sqlalchemy import Column, Integer, String, Text, Date, Enum, DateTime, func

from ..core.database import Base

class Lembrete(Base):
    __tablename__ = "lembretes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, nullable=False)
    titulo = Column(String(150), nullable=False)
    descricao = Column(Text, nullable=True)
    data_vencimento = Column(Date, nullable=False)
    categoria = Column(
        Enum('FISCAL', 'TRABALHISTA', 'PESSOAL', name='categoria_enum'),
        nullable=False,
        default='PESSOAL',
    )
    prioridade = Column(
        Enum('BAIXA', 'MEDIA', 'ALTA', name='prioridade_enum'),
        nullable=False,
        default='MEDIA',
    )
    concluido = Column(Integer, nullable=False, default=0)
    criado_em = Column(DateTime, nullable=False, server_default=func.current_timestamp())
    atualizado_em = Column(DateTime, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())
