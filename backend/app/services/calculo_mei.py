"""
Serviço: Cálculo básico MEI.
"""

# Valores fixos do DAS MEI 2025 por categoria
DAS_MEI_VALORES = {
    "COMERCIO": 75.90,
    "SERVICOS": 80.90,
    "COMERCIO_SERVICOS": 86.90,
}

DEFAULT_DAS = 86.90


def calcular_mei(faturamento_mensal: float, cnae: str | None = None) -> dict:
    """Calcula o DAS estimado e a margem líquida simples para MEI."""
    das = DEFAULT_DAS
    if cnae:
        chave = cnae.strip().upper().replace(" ", "_")
        das = DAS_MEI_VALORES.get(chave, DEFAULT_DAS)

    margem_liquida = round(max(0.0, faturamento_mensal - das), 2)
    return {
        "faturamento_mensal": faturamento_mensal,
        "das_estimado": das,
        "margem_liquida": margem_liquida,
        "cnae": cnae,
    }
