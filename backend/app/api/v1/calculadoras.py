from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.services.calculo_inss import calcular_inss
from app.services.calculo_irpf import calcular_irpf
from app.services.calculo_mei import calcular_mei
from app.services.comparador_clt_pj import comparar_clt_pj
from app.core.database import get_db
from app.services.gamificacao_service import ensure_default_conquistas, conceder_conquista

router = APIRouter()

# Rotas de simulação financeira: CLT, CLT vs PJ e MEI.
# Os modelos definem a validação dos dados de requisição.
class SimulacaoCLT(BaseModel):
    salario_bruto: float
    dependentes: int = 0

class SimulacaoCLTvPJ(BaseModel):
    salario_bruto: float
    dependentes: int = 0

class SimulacaoMEI(BaseModel):
    faturamento_mensal: float
    cnae: str | None = None

@router.post("/clt")
def calcular_clt(simulacao: SimulacaoCLT, db=Depends(get_db)):
    # Calcula INSS e IRPF sobre o salário bruto e retorna o líquido mensal.
    inss = calcular_inss(simulacao.salario_bruto)
    base_irpf = simulacao.salario_bruto - inss["total"]
    irpf = calcular_irpf(base_irpf, simulacao.dependentes)
    liquido = round(simulacao.salario_bruto - inss["total"] - irpf["imposto"], 2)

    return {
        "salario_bruto": simulacao.salario_bruto,
        "desconto_inss": inss["total"],
        "desconto_irpf": irpf["imposto"],
        "liquido_mensal": liquido,
        "detalhes_inss": inss["faixas"],
        "detalhes_irpf": irpf,
    }

    # O código abaixo está preparado para conceder uma conquista no futuro.
    # Atualmente ele não é executado porque aparece após o return.
    try:
        ensure_default_conquistas(db)
        conceder_conquista(db, 1, "primeira_simulacao")
    except Exception:
        pass

@router.post("/clt-vs-pj")
def comparar_clt_pj_endpoint(simulacao: SimulacaoCLTvPJ):
    # Compara custos CLT e PJ para ajudar o usuário a avaliar opções.
    return comparar_clt_pj(simulacao.salario_bruto, simulacao.dependentes)

@router.post("/mei")
def simular_mei(simulacao: SimulacaoMEI):
    # Simula os custos e impostos de um MEI com base no faturamento.
    return calcular_mei(simulacao.faturamento_mensal, simulacao.cnae)
