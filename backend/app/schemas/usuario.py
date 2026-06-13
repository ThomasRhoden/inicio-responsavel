from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    situacao_atual: Optional[str] = None
    renda_mensal: Optional[float] = None
    area_interesse: Optional[str] = None

class UsuarioRead(BaseModel):
    id: int
    nome: str
    email: EmailStr
    situacao_atual: Optional[str] = None
    renda_mensal: Optional[float] = None
    area_interesse: Optional[str] = None

    model_config = {
        "from_attributes": True
    }
