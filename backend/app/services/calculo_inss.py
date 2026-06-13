"""
Serviço: Cálculo do INSS Empregado (tabela progressiva 2025)
Fonte: Portaria MPS nº 1, de 10 de janeiro de 2025
"""

# Tabela progressiva INSS 2025
# (faixa_min, faixa_max, aliquota)
TABELA_INSS_2025 = [
    (0.00,      1518.00,  0.075),
    (1518.01,   2793.88,  0.090),
    (2793.89,   4190.83,  0.120),
    (4190.84,   8157.41,  0.140),
]

TETO_INSS = 8157.41


def calcular_inss(salario_bruto: float) -> dict:
    """
    Calcula o INSS progressivo sobre o salário bruto.
    Retorna o valor total descontado e o detalhamento por faixa.
    """
    if salario_bruto <= 0:
        return {"total": 0.00, "faixas": []}

    base = min(salario_bruto, TETO_INSS)
    total = 0.00
    detalhamento = []

    for faixa_min, faixa_max, aliquota in TABELA_INSS_2025:
        if base <= faixa_min:
            break

        valor_na_faixa = min(base, faixa_max) - faixa_min
        desconto = round(valor_na_faixa * aliquota, 2)
        total += desconto

        detalhamento.append({
            "faixa":    f"R$ {faixa_min:,.2f} – R$ {faixa_max:,.2f}",
            "aliquota": f"{aliquota * 100:.1f}%",
            "desconto": desconto
        })

    return {
        "total":   round(total, 2),
        "faixas":  detalhamento
    }
