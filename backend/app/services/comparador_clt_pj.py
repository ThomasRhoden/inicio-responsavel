"""
Serviço: Comparador CLT vs PJ
Calcula o valor líquido real em cada regime para o mesmo trabalho.
"""

from app.services.calculo_inss import calcular_inss
from app.services.calculo_irpf import calcular_irpf

# Alíquota FGTS (empregador deposita, empregado não desconta no líquido
# mas perde ao ir para PJ — incluído na análise como benefício perdido)
ALIQUOTA_FGTS       = 0.08
ALIQUOTA_FERIAS     = 1 / 12       # 1 mês por ano
ALIQUOTA_DECIMO_TERCEIRO = 1 / 12  # 1 salário por ano

# ISS médio sobre nota fiscal PJ (varia por município, usando média nacional)
ALIQUOTA_ISS_MEDIO  = 0.05

# Alíquota aproximada IRPJ + CSLL no Simples Nacional (faixa inicial)
ALIQUOTA_SIMPLES_SERVICOS = 0.06


def comparar_clt_pj(salario_bruto_clt: float, dependentes: int = 0) -> dict:
    """
    Dado o salário bruto CLT, calcula o líquido real em cada regime
    e retorna o comparativo lado a lado.
    """

    # ── CLT ──────────────────────────────────────────────────────────
    inss      = calcular_inss(salario_bruto_clt)
    base_irpf = salario_bruto_clt - inss["total"]
    irpf      = calcular_irpf(base_irpf, dependentes)

    clt_liquido_mensal = round(
        salario_bruto_clt - inss["total"] - irpf["imposto"], 2
    )

    # Benefícios embutidos no CLT (valor mensal equivalente)
    fgts_mensal          = round(salario_bruto_clt * ALIQUOTA_FGTS, 2)
    ferias_mensal        = round(salario_bruto_clt * ALIQUOTA_FERIAS, 2)
    decimo_mensal        = round(salario_bruto_clt * ALIQUOTA_DECIMO_TERCEIRO, 2)

    clt_remuneracao_real = round(
        clt_liquido_mensal + fgts_mensal + ferias_mensal + decimo_mensal, 2
    )

    # ── PJ ───────────────────────────────────────────────────────────
    # Para equivaler ao CLT, o PJ precisa cobrar mais para cobrir os
    # benefícios que deixa de receber.
    # Faturamento sugerido = salário bruto + benefícios perdidos
    faturamento_pj_sugerido = round(
        salario_bruto_clt + fgts_mensal + ferias_mensal + decimo_mensal, 2
    )

    iss      = round(faturamento_pj_sugerido * ALIQUOTA_ISS_MEDIO, 2)
    simples  = round(faturamento_pj_sugerido * ALIQUOTA_SIMPLES_SERVICOS, 2)
    inss_pj  = calcular_inss(salario_bruto_clt)  # pró-labore ≈ salário base

    # IRPF sobre pró-labore menos INSS PJ
    base_irpf_pj = salario_bruto_clt - inss_pj["total"]
    irpf_pj      = calcular_irpf(base_irpf_pj, dependentes)

    pj_liquido = round(
        faturamento_pj_sugerido
        - iss
        - simples
        - inss_pj["total"]
        - irpf_pj["imposto"],
        2
    )

    diferenca = round(pj_liquido - clt_liquido_mensal, 2)

    return {
        "clt": {
            "salario_bruto":        salario_bruto_clt,
            "desconto_inss":        inss["total"],
            "desconto_irpf":        irpf["imposto"],
            "liquido_mensal":       clt_liquido_mensal,
            "fgts_depositado":      fgts_mensal,
            "ferias_provisionadas": ferias_mensal,
            "decimo_provisionado":  decimo_mensal,
            "remuneracao_real":     clt_remuneracao_real,
        },
        "pj": {
            "faturamento_sugerido": faturamento_pj_sugerido,
            "iss":                  iss,
            "simples_nacional":     simples,
            "inss_pro_labore":      inss_pj["total"],
            "irpf_pro_labore":      irpf_pj["imposto"],
            "liquido_mensal":       pj_liquido,
        },
        "comparativo": {
            "diferenca_liquido":    diferenca,
            "vantagem":             "PJ" if diferenca > 0 else "CLT",
            "observacao": (
                "O PJ pode ter mais líquido, mas perde FGTS, férias e 13º. "
                "Avalie o custo-benefício completo antes de decidir."
            )
        }
    }
