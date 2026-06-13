"""
Serviço: Cálculo do IRPF (tabela progressiva 2025)
Fonte: Instrução Normativa RFB nº 2.178, de 2024
"""

# Tabela IRPF 2025
# (faixa_min, faixa_max, aliquota, deducao)
TABELA_IRPF_2025 = [
    (0.00,      2824.00,  0.000,  0.00),
    (2824.01,   3751.05,  0.075,  211.80),
    (3751.06,   4664.68,  0.150,  493.42),
    (4664.69,   6101.06,  0.225,  842.49),
    (6101.07,   float("inf"), 0.275, 1147.49),
]

DEDUCAO_DEPENDENTE = 189.59  # Por dependente por mês


def calcular_irpf(base_calculo: float, dependentes: int = 0) -> dict:
    """
    Calcula o IRPF mensal sobre a base de cálculo.
    Base de cálculo = salário bruto - INSS - (dependentes × dedução)

    Retorna o imposto devido e a alíquota efetiva.
    """
    deducao_dependentes = dependentes * DEDUCAO_DEPENDENTE
    base = max(0.00, base_calculo - deducao_dependentes)

    imposto = 0.00
    aliquota_efetiva = 0.00

    for faixa_min, faixa_max, aliquota, deducao in TABELA_IRPF_2025:
        if base <= faixa_min:
            break
        if base <= faixa_max:
            imposto = round((base * aliquota) - deducao, 2)
            aliquota_efetiva = round((imposto / base) * 100, 2) if base > 0 else 0.00
            break

    return {
        "base_calculo":      round(base, 2),
        "imposto":           max(0.00, imposto),
        "aliquota_efetiva":  f"{aliquota_efetiva:.2f}%",
        "deducao_dependentes": round(deducao_dependentes, 2)
    }
