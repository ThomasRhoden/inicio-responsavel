from pydantic import BaseModel


class ConquistaRead(BaseModel):
    id: int
    chave: str
    titulo: str
    descricao: str | None
    pontos: int

    model_config = {"from_attributes": True}


class GamificacaoRead(BaseModel):
    usuario_id: int
    pontos: int
    conquistas: list[ConquistaRead]

    model_config = {"from_attributes": True}
