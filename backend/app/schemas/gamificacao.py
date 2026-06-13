from pydantic import BaseModel

# Esquema que representa uma conquista liberada para o usuário.
class ConquistaRead(BaseModel):
    id: int
    chave: str
    titulo: str
    descricao: str | None
    pontos: int

    model_config = {"from_attributes": True}

# Esquema que representa o estado de gamificação de um usuário.
class GamificacaoRead(BaseModel):
    usuario_id: int
    pontos: int
    conquistas: list[ConquistaRead]

    model_config = {"from_attributes": True}
