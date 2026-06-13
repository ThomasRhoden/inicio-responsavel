# Início Responsável

Projeto em desenvolvimento com backend em FastAPI e frontend em Next.js.

## Alterações implementadas

- Corrigida a localização para português brasileiro na UI do frontend.
- Ajustado visual com tema RPG/gameficação e painéis de gamificação.
- Verificados e instalados dependências do backend e frontend.
- Frontend compilou com sucesso usando `npm run build`.
- Backend FastAPI responde corretamente em `http://127.0.0.1:8000`.
- Frontend Next.js está ativo em `http://127.0.0.1:3000`.

## Como executar

### Backend

1. Ative o ambiente virtual em `backend/venv`.
2. Execute:

```powershell
cd C:\Users\rhode\Desktop\Inicio_Responsavel
.\backend\venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

### Frontend

1. Use Node.js instalado em `C:\Program Files\nodejs`.
2. Execute:

```powershell
cd C:\Users\rhode\Desktop\Inicio_Responsavel\frontend
$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
& 'C:\Program Files\nodejs\npm.cmd' run dev -- --hostname 127.0.0.1 --port 3000
```

## Testes realizados

- `GET /` no backend retornou status OK.
- `GET /gamificacao/1` retornou informações de gamificação.
- `GET /lembretes` retornou lista de lembretes.
- Frontend carregou com sucesso em `http://127.0.0.1:3000`.

## Próximos passos

- Continuar o ajuste visual com avatar RPG e elementos de experiência.
- Testar fluxos no frontend (criação de lembretes, criação de usuário, simulação CLT/MEI).
