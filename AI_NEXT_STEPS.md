# AI Next Steps - Início Responsável

## Objetivo
Este documento serve como um briefing para outra inteligência artificial entender o estado atual do projeto, o que já está implementado e quais devem ser os próximos passos de desenvolvimento.

## Visão geral do projeto

O projeto `Início Responsável` é uma aplicação web híbrida que combina:
- Backend em **FastAPI** (Python)
- Frontend em **Next.js** (React + Tailwind)
- Gamificação com pontos, conquistas e painel RPG
- Banco de dados local em **SQLite** com fallback automático do backend

A aplicação pretende orientar o usuário brasileiro em finanças e carreira, com simulações de CLT, MEI e comparativo CLT vs PJ, além de um sistema de lembretes.

## Arquitetura atual

### Backend
- `backend/main.py` - app FastAPI principal com CORS e router principal.
- `backend/app/core/database.py` - configuração de banco e fallback SQLite.
- `backend/app/api/v1/` - roteadores da API versão 1:
  - `usuarios.py` - CRUD de usuário simples.
  - `lembretes.py` - cria/lista lembretes e concede conquista de primeiro lembrete.
  - `calculadoras.py` - simulações de CLT, CLT-vs-PJ e MEI.
  - `gamificacao.py` - consulta gamificação e concede conquistas manualmente.
- `backend/app/services/` - regras de negócio e cálculos financeiros.
- `backend/app/models/` - modelos SQLAlchemy para `Usuario`, `Lembrete`, `Conquista`, `UsuarioConquista`.
- `backend/app/schemas/` - Pydantic para validação de payloads.

### Frontend
- `frontend/src/app/page.jsx` - página principal com abas, formulários e painel de gamificação.
- `frontend/src/services/api.js` - abstração das requisições ao backend.
- `frontend/src/components/Badge.jsx` - badge de conquista.
- `frontend/src/app/globals.css` - tema escuro, visual RPG, cartas de avatar e barra de XP.
- `frontend/src/app/layout.jsx` - layout raiz com metadados.

### Documentação e instruções
- `README.md` - resumo do projeto e instruções de execução.
- `COMO_RODAR_LOCALMENTE.md` - passo a passo para rodar backend e frontend localmente.
- `DocumentacaoComentada.md` - resumo dos arquivos comentados em português.
- `Documentacao.md` - documento de alto nível com evolução e contexto do projeto.
- `CHANGELOG.md` - histórico de modificações recentes.

## Estado atual

### Funções implementadas
- Backend e frontend estão funcionando localmente.
- `http://127.0.0.1:8000/` responde corretamente.
- `http://127.0.0.1:3000/` exibe o frontend Next.js.
- Endpoints principais válidos:
  - `/gamificacao/1`
  - `/lembretes`
  - `/simular/clt`
  - `/simular/mei`
- Comentários em português aplicados a quase todos os arquivos de código.
- Gamificação básica já persistente e integrada à criação de lembretes.

### Itens verificáveis
- O backend está ativo com fallback SQLite.
- A API docs do FastAPI está disponível em `/docs`.
- O frontend carrega a página inicial e form inputs.

## Problemas/pontos de atenção conhecidos

- O frontend ainda precisa de polimento visual e UX mais clara para abas e formulários.
- A gamificação está funcional, mas básica e pode ser expandida.
- O endpoint `/simular/clt` injeta lógica de conquista pós-return, o que significa que a conquista de simulação não é atualmente concedida.
- Algumas strings no sistema ainda podem estar com codificação quebrada (`InÃcio ResponsÃ¡vel`), embora a interface principal esteja em português.
- A página do frontend ainda exibe resultados em JSON bruto em vez de uma visualização amigável.

## Próximos passos recomendados

### 1. Ajustar a gamificação e UX
- Implementar um avatar RPG mais detalhado e/ou animado.
- Criar níveis e progressão visual mais claros (barras, medalhas, status).
- Garantir que a conquista `primeira_simulacao` seja concedida corretamente após simulação CLT.
- Adicionar mais eventos de gamificação, como:
  - criação de usuário
  - criação de lembrete
  - execução de simulação MEI
  - comparação CLT vs PJ

### 2. Melhorar o frontend e o fluxo de usuário
- Refatorar a exibição de resultados para uma UI estruturada em vez de `JSON.stringify`.
- Ajustar formulários para validação básica de campos antes do envio.
- Adicionar feedback visual de sucesso/erro em todas as ações.
- Melhorar layout responsivo e paleta de cores.

### 3. Consolidar backend e consistência de API
- Verificar se todos os endpoints estão sob `api/v1` ou se existem rotas diretas sem prefixo.
- Documentar claramente o contrato de API usado pelo frontend.
- Adicionar esquemas de resposta mais robustos para `Lembrete` e `Gamificacao`.

### 4. Testes e qualidade
- Implementar testes automatizados para endpoints principais.
- Criar scripts de integração e verificações de smoke test.
- Validar disponibilidade do frontend e backend após reinício.

### 5. Documentação para desenvolvedores
- Atualizar `README.md` com instruções mais completas e exemplos de uso.
- Manter `COMO_RODAR_LOCALMENTE.md` e `DocumentacaoComentada.md` sincronizados.
- Adicionar um documento específico de roadmap técnica para futuras iterações.

## Sugestão de tarefas imediatas

1. Corrigir o bug de `primeira_simulacao` não sendo concedida devido ao `return` antes da lógica de conquista.
2. Remodelar o componente de resultado no frontend para apresentar valores de simulação CLT, MEI e CLT vs PJ.
3. Adicionar uma página ou componente de conquistas detalhado com badges desbloqueadas e travadas.
4. Garantir localização completa para português em todos os textos, inclusive metadados e mensagens de erro.
5. Verificar e corrigir codificação de texto (`Início Responsável`) quando necessário.

## Instruções de execução local para outra IA

- Backend: usar `backend/venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --reload --host 127.0.0.1 --port 8000`
- Frontend: usar `frontend\npm install` e `frontend\npm run dev -- --hostname 127.0.0.1 --port 3000`
- Validar com as URLs:
  - `http://127.0.0.1:8000/`
  - `http://127.0.0.1:8000/docs`
  - `http://127.0.0.1:3000/`

## Arquivos-chave para revisitar

- `backend/app/api/v1/calculadoras.py`
- `backend/app/services/gamificacao_service.py`
- `frontend/src/app/page.jsx`
- `frontend/src/services/api.js`
- `frontend/src/app/globals.css`
- `README.md`
- `COMO_RODAR_LOCALMENTE.md`
- `DocumentacaoComentada.md`

## Mensagem para a próxima IA

A próxima IA deve priorizar transformar o protótipo existente em uma experiência mais polida: tornar a gamificação mais visível, corrigir o fluxo de simulação e melhorar a apresentação de resultados no frontend. O backend está funcional e deve ser mantido estável enquanto a interface e as regras de engajamento são aprimoradas.
