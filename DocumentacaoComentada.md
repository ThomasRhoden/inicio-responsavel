# Documentação Comentada

## Visão geral
Este documento resume a cobertura de comentários em português no projeto "Início Responsável" e descreve a organização do backend, frontend e scripts auxiliares.

## Backend
Todos os arquivos de código Python do backend foram comentados em português, incluindo:

- `backend/main.py`
- `backend/app/core/database.py`
- `backend/app/api/v1/__init__.py`
- `backend/app/api/v1/usuarios.py`
- `backend/app/api/v1/lembretes.py`
- `backend/app/api/v1/calculadoras.py`
- `backend/app/api/v1/gamificacao.py`
- `backend/app/services/gamificacao_service.py`
- `backend/app/services/comparador_clt_pj.py`
- `backend/app/services/calculo_mei.py`
- `backend/app/services/calculo_irpf.py`
- `backend/app/services/calculo_inss.py`
- `backend/app/models/usuario.py`
- `backend/app/models/lembrete.py`
- `backend/app/models/conquista.py`
- `backend/app/schemas/usuario.py`
- `backend/app/schemas/lembrete.py`
- `backend/app/schemas/gamificacao.py`
- `backend/app/api/__init__.py`
- `backend/app/core/__init__.py`
- `backend/app/services/__init__.py`
- `backend/app/models/__init__.py`
- `backend/app/schemas/__init__.py`
- `backend/__init__.py`

### Observações importantes
- O backend funciona com FastAPI e está centralizado em `backend/main.py`.
- O módulo `backend/app/core/database.py` usa variáveis de ambiente e faz fallback automático para SQLite local (`backend/dev.sqlite3`) caso a conexão MySQL falhe.
- `backend/app/api/v1/__init__.py` agrupa as rotas de usuários, lembretes, simulações e gamificação.
- A gamificação inclui lógica de conquistas e pontos no serviço `backend/app/services/gamificacao_service.py`.

## Frontend
Os principais arquivos frontend foram comentados para explicar a lógica e o visual gamificado:

- `frontend/src/app/page.jsx`
- `frontend/src/services/api.js`
- `frontend/src/components/Badge.jsx`
- `frontend/src/app/layout.jsx`
- `frontend/src/app/globals.css`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`

### Destaques do frontend
- `page.jsx` controla abas, formulários e exibe painel de gamificação com nível, XP e conquistas.
- `api.js` encapsula todas as chamadas ao backend com wrappers para usuários, lembretes e simulações.
- `Badge.jsx` exibe um emblema visual para conquistas desbloqueadas ou bloqueadas.
- O CSS global adiciona tema escuro, estilo RPG para cartões e barra de XP.

## Scripts auxiliares
Também foram documentados os scripts auxiliares:

- `backend/scripts/test_requests.py` — script de teste para consumir endpoints do backend.
- `backend/scripts/db_inspect.py` — script para inspecionar o banco SQLite de desenvolvimento.

## Como executar localmente

### Backend
1. Navegue até o diretório do backend:
   ```powershell
   cd C:\Users\rhode\Desktop\Inicio_Responsavel\backend
   ```
2. Inicie o servidor FastAPI:
   ```powershell
   .\venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000
   ```

### Frontend
1. Navegue até o diretório do frontend:
   ```powershell
   cd C:\Users\rhode\Desktop\Inicio_Responsavel\frontend
   ```
2. Instale dependências (se ainda não estiverem instaladas):
   ```powershell
   npm install
   ```
3. Inicie a aplicação React/Next.js:
   ```powershell
   npm run dev -- --hostname 127.0.0.1 --port 3000
   ```

## Estado atual
- Comentários em português aplicados a todo o código fonte.
- Documentação adicional do projeto alinhada com o estilo do backend e frontend.
- O sistema está pronto para ajustes visuais finais e testes de fluxo no frontend.

## Próximos passos sugeridos
- Finalizar ajustes visuais no painel de gamificação.
- Testar fluxo completo de criação de usuário, lembrete e simulação.
- Atualizar `README.md` com instruções de execução se desejar um guia de uso final.
