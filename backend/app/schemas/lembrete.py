from pydantic import BaseModel
from datetime import date
from typing import Optional

class LembreteCreate(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    data_vencimento: date
    categoria: str = "PESSOAL"
    prioridade: str = "MEDIA"

class LembreteRead(LembreteCreate):
    id: int
    concluido: bool = False

    model_config = {
        "from_attributes": True
    }
