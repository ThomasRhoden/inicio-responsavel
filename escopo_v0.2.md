# INÍCIO RESPONSÁVEL
## Escopo do Produto — Versão 0.2 (Atualizado)
**Data:** Junho de 2026  
**Objetivo:** Guiar o brasileiro que está começando — ou recomeçando.

---

### 1. Visão Geral
[cite_start]O Início Responsável é uma plataforma web que guia cidadãos brasileiros em sua jornada financeira e profissional, do primeiro emprego à abertura e consolidação de um negócio próprio[cite: 6]. [cite_start]O sistema apresenta a realidade fiscal e trabalhista brasileira de forma simples, visual e gamificada — acessível a qualquer pessoa, independentemente do nível de escolaridade ou experiência[cite: 7].

[cite_start]O produto não é um simulador de impostos genérico[cite: 8]. [cite_start]É um guia de vida com dados reais, calculadoras práticas e um mapa claro de "onde estou" e "onde posso chegar"[cite: 8].

---

### 2. Problema que Resolve
[cite_start]A maioria dos brasileiros não entende sua própria situação fiscal e trabalhista[cite: 10].
* [cite_start]Um jovem de 17 anos desempregado não sabe por onde começar[cite: 11].
* [cite_start]Um CLT de 35 anos não sabe quanto custa para a empresa nem como comparar sua situação com a de um PJ[cite: 12].
* [cite_start]Um microempreendedor não sabe quando vale a pena migrar do MEI para o Simples Nacional[cite: 13].

[cite_start]O resultado é paralisia, decisões mal-informadas e oportunidades perdidas[cite: 14]. [cite_start]O Início Responsável resolve isso com informação acessível, progressiva e orientada à ação[cite: 14].

---

### 3. Público-Alvo
#### 3.1 Perfis Primários

| Perfil | Situação | O que busca |
| :--- | :--- | :--- |
| **Jovem iniciante** | Desempregado, 16–20 anos | [cite_start]Primeiro emprego, área de atuação [cite: 17] |
| **CLT consolidado** | Empregado formal, 25–40 anos | [cite_start]Entender seus direitos e custos [cite: 17] |
| **Empreendedor inicial** | MEI ou quer abrir empresa | [cite_start]Comparar regimes, planejar migração [cite: 17] |
| **Recomeçando** | Demitido ou em transição | [cite_start]Mapa de próximos passos concretos [cite: 17] |

---

### 4. Jornada do Usuário (Níveis)
[cite_start]O sistema é organizado em níveis progressivos, como uma trilha[cite: 19]. [cite_start]O usuário informa sua situação atual e o sistema posiciona onde ele está e mostra o próximo nível alcançável[cite: 20].

| Nível | Situação | Próximo Passo Sugerido |
| :--- | :--- | :--- |
| **Nível 0** | Desempregado | [cite_start]Buscar estágio ou menor aprendiz, escolher área de atuação [cite: 21] |
| **Nível 1** | Primeiro emprego (CLT) | [cite_start]Entender contracheque, INSS, FGTS, direitos básicos [cite: 21] |
| **Nível 2** | CLT com reserva | [cite_start]Comparar CLT vs PJ, calcular precificação como autônomo [cite: 21] |
| **Nível 3** | Autônomo / MEI | [cite_start]Obrigações do MEI, limites de faturamento, emissão de NF [cite: 21] |
| **Nível 4** | MEI crescendo | [cite_start]Quando migrar para ME/Simples Nacional, custos da transição [cite: 21] |
| **Nível 5** | ME / Simples Nacional | [cite_start]Planejamento tributário, pró-labore, distribuição de lucros [cite: 21] |

---

### 5. Funcionalidades — MVP
[cite_start]O MVP (Mínimo Produto Viável) cobre os primeiros **3 níveis** da jornada (Níveis 0, 1 e 2) e as funcionalidades essenciais para validar o conceito[cite: 23].

#### 5.1 Perfil do Usuário
* [cite_start]Cadastro simples: nome, situação atual, renda (se aplicável), área de interesse[cite: 25].
* [cite_start]Posicionamento automático do usuário em um nível da jornada[cite: 26].
* [cite_start]Dashboard com "você está aqui" e barra de progresso visual[cite: 27].

#### 5.2 Calculadoras
* [cite_start]**Calculadora CLT:** salário bruto $\rightarrow$ líquido (INSS + IRPF + descontos)[cite: 29].
* [cite_start]**Calculadora de Custo Real:** salário bruto $\rightarrow$ custo total ao empregador (salário + encargos + FGTS + benefícios básicos)[cite: 30].
* [cite_start]**Calculadora CLT vs PJ:** mesmo trabalho de forma comparativa, mostrando o valor real líquido que sobra em cada regime após impostos[cite: 31].
* [cite_start]**Calculadora MEI:** faturamento bruto $\rightarrow$ custos mensais (DAS) e margem líquida[cite: 32].

#### 5.3 Guias por Nível
* [cite_start]Cada nível tem um guia textual com linguagem simples e direta[cite: 34].
* [cite_start]Lista de documentos necessários para cada transição[cite: 35].
* [cite_start]Links para órgãos oficiais (gov.br, receita federal, e-Social)[cite: 36].

#### 5.4 Simulador de Transição
* [cite_start]"Quero sair do CLT" $\rightarrow$ simulação de quando e como fazer a mudança de forma segura[cite: 38].
* [cite_start]Sugestão de reserva financeira mínima recomendada antes da transição (com base no perfil de gastos informado)[cite: 39].
* [cite_start]Checklist de passos práticos de ação[cite: 40].

---

### 6. Stack Técnica

| Camada | Tecnologia | Responsabilidade / Justificativa |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React) | [cite_start]Interface visual, dashboards dinâmicos, calculadoras[cite: 42]. |
| **Backend / API** | Python + FastAPI | [cite_start]Lógica de negócio, rotas REST rápidas e cálculos[cite: 42]. |
| **Banco de Dados** | MySQL | [cite_start]Modelagem relacional para perfis, tabelas fiscais, lembretes e logs[cite: 42]. |
| **Hospedagem** | Vercel (frontend) | [cite_start]Deploy contínuo, domínio público para portfólio[cite: 42]. |
| **Banco (cloud)** | PlanetScale ou Railway | [cite_start]Instância MySQL gerenciada, gratuita para validação do MVP[cite: 42]. |

---

### 7. Modelagem de Dados (Esboço)
[cite_start]As tabelas principais do banco MySQL para o MVP[cite: 44]:

* [cite_start]**`usuarios`** [cite: 45]
  * [cite_start]`id`, `nome`, `email`, `senha_hash`, `situacao_atual` (enum), `renda_mensal`, `area_interesse`, `nivel_atual`, `criado_em`[cite: 46].
  * *Nota de Segurança (LGPD):* Dados sensíveis como renda e perfil devem ser guardados com segurança e criptografia adequada.
* [cite_start]**`lembretes`** [cite: 47]
  * [cite_start]`id`, `usuario_id`, `titulo`, `descricao`, `data_vencimento`, `categoria` (fiscal/pessoal/trabalhista), `concluido`[cite: 48].
* [cite_start]**`tabelas_fiscais`** [cite: 49]
  * `id`, `tipo` (INSS/IRPF/MEI), `faixa_min`, `faixa_max`, `aliquota`, `deducao`, `vigencia_inicio`, `vigencia_fim`[cite: 50].
  * *Nota de Arquitetura:* A estrutura temporal (`vigencia`) impede que as mudanças de alíquotas do governo quebrem as simulações históricas do usuário.
* **`simulacoes`** [cite: 51]
  * [cite_start]`id`, `usuario_id`, `tipo_simulacao`, `parametros_json`, `resultado_json`, `criado_em`[cite: 52].

---

### 8. Diferenciais do Produto
* **Linguagem Simples:** Não é um sistema para contadores, é uma ferramenta de inclusão para qualquer cidadão[cite: 54].
* [cite_start]**Gamificação:** Progresso visível e níveis claros trazem um senso de evolução contínua para as finanças[cite: 55].
* [cite_start]**Dados Reais e Atualizáveis:** Uso de tabelas governamentais dinâmicas, mitigando estimativas genéricas[cite: 56].
* **Ação Concreta:** Cada tela ou resultado de calculadora termina com um gancho prático de "o que fazer agora"[cite: 57].
* [cite_start]**Tema Diferenciado no Portfólio:** Foge dos projetos clichês (como clones de e-commerce ou to-do lists), demonstrando domínio sobre regras de negócio reais do mercado brasileiro[cite: 58].

---

### 9. Fora do Escopo — MVP
* [cite_start]Integração automatizada via API com a Receita Federal ou e-Social[cite: 60].
* Declaração de Imposto de Renda automatizada[cite: 61].
* [cite_start]Módulo de contabilidade completa[cite: 62].
* [cite_start]Aplicativo mobile nativo (iOS/Android) — o foco inicial é web responsivo[cite: 63].
* Notificações ativas por e-mail ou WhatsApp (recurso postergado para a Versão 1.0)[cite: 64].
* [cite_start]Suporte a múltiplos idiomas[cite: 65].

---

### 10. Próximos Passos
1. [cite_start]Validar e aprovar este escopo atualizado (v0.2)[cite: 67].
2. [cite_start]Criar o schema SQL completo (tabelas, chaves estrangeiras e indexações)[cite: 68].
3. [cite_start]Montar a arquitetura base do projeto no GitHub (Next.js + FastAPI estruturado)[cite: 69].
4. [cite_start]Desenvolver as funções matemáticas de cálculo fiscal no backend Python[cite: 70].
5. [cite_start]Criar o dashboard dinâmico e os componentes de formulários no Next.js[cite: 71].
6. [cite_start]Realizar o deploy público na Vercel para apresentação em portfólio[cite: 72].

---
> [cite_start]**Documento embrionário.** Sujeito a revisões conforme o projeto evolui[cite: 73].