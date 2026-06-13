from pydantic import BaseModel
from datetime import date
from typing import Optional

# Esquema para criar um novo lembrete.
class LembreteCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    data_vencimento: date
    categoria: str = "PESSOAL"
    prioridade: str = "MEDIA"

# Esquema para mostrar lembretes retornados pela API.
class LembreteRead(LembreteCreate):
    id: int
    concluido: bool = False

    model_config = {
        "from_attributes": True
    }
