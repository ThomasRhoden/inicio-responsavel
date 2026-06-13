# Como rodar tudo localmente

Este guia explica como iniciar o backend e o frontend do projeto `Início Responsável` em sua máquina Windows.

## Pré-requisitos

- Python 3.12+ instalado
- Node.js instalado (por exemplo, `C:\Program Files\nodejs`)\
- `npm` disponível no PATH ou via `C:\Program Files\nodejs\npm.cmd`
- Já existe um ambiente virtual em `backend/venv`
- O projeto está no diretório `C:\Users\rhode\Desktop\Inicio_Responsavel`

## Passo 1: Iniciar o backend

1. Abra o PowerShell.
2. Navegue até a pasta do projeto:
   ```powershell
   cd C:\Users\rhode\Desktop\Inicio_Responsavel
   ```
3. Inicie o backend usando o Python do ambiente virtual:
   ```powershell
   .\backend\venv\Scripts\python.exe -m uvicorn main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
   ```

### Observações
- O backend utiliza FastAPI e expõe a API em `http://127.0.0.1:8000`.
- Se a porta `8000` já estiver ocupada, altere `--port 8000` para outra porta disponível, como `8001`.
- O backend também já carrega o fallback SQLite local em `backend/dev.sqlite3` se não conseguir conectar ao MySQL.

## Passo 2: Iniciar o frontend

1. Abra outro terminal PowerShell.
2. Navegue até a pasta do frontend:
   ```powershell
   cd C:\Users\rhode\Desktop\Inicio_Responsavel\frontend
   ```
3. Instale dependências (caso ainda não tenha feito):
   ```powershell
   npm install
   ```
4. Inicie o frontend:
   ```powershell
   $env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
   & 'C:\Program Files\nodejs\npm.cmd' run dev -- --hostname 127.0.0.1 --port 3000
   ```

### Observações
- O frontend roda em `http://127.0.0.1:3000`.
- Se precisar alterar a porta, modifique `--port 3000` para outra porta disponível.
- O frontend consome o backend em `http://localhost:8000` por padrão.

## Passo 3: Verificar a aplicação

### Backend
- Abra um navegador ou use `curl`/PowerShell e acesse:
  - `http://127.0.0.1:8000/`
- O retorno esperado é algo como:
  - `{"status":"ok","projeto":"Início Responsável API v0.1"}`

### Frontend
- Abra o navegador em:
  - `http://127.0.0.1:3000/`
- A interface deve carregar com o painel de gamificação, abas de simulação, lembretes e cadastro de usuário.

## Endpoints úteis

- `GET /` — health check do backend
- `GET /api/v1/usuarios/{usuario_id}` — busca usuário
- `POST /api/v1/usuarios` — cria usuário
- `GET /api/v1/lembretes` — lista lembretes
- `POST /api/v1/lembretes` — cria lembrete
- `POST /api/v1/simular/clt` — simula CLT
- `POST /api/v1/simular/mei` — simula MEI
- `GET /api/v1/gamificacao/{usuario_id}` — retorna gamificação do usuário

> Observação: os endpoints reais da API estão em `http://127.0.0.1:8000/api/v1/...` se o router estiver configurado assim. Caso o backend esteja disponível apenas em `/`, use `http://127.0.0.1:8000/...`.

## Testes rápidos

### Teste de backend
No PowerShell, rode:
```powershell
Invoke-WebRequest -Uri 'http://127.0.0.1:8000/' -UseBasicParsing
```

### Teste de frontend
Abra no navegador:
- `http://127.0.0.1:3000/`

## Problemas comuns

- **Porta 8000 ocupada**: altere para outra porta disponível.
- **Node não encontrado**: use o caminho completo `C:\Program Files\nodejs\npm.cmd`.
- **Dependências não instaladas**: rode `npm install` dentro de `frontend`.
- **Backend não inicializa**: verifique se o ambiente virtual `backend/venv` existe e se o Python correto está sendo usado.

## Observação final
Este documento descreve como iniciar o stack localmente no Windows, com backend FastAPI e frontend Next.js. Se quiser, posso também gerar um `README.md` atualizado com estas instruções.
