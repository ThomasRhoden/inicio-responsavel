# Início Responsável

> 🇧🇷 Plataforma de orientação fiscal e profissional para cidadãos brasileiros.
> 🇺🇸 Tax and career guidance platform for Brazilian citizens.

![Status](https://img.shields.io/badge/status-descontinuado%20%2F%20discontinued-lightgrey) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)

## 📖 Visão geral

Backend em FastAPI e frontend em Next.js com calculadoras (INSS, IRPF, MEI, comparador CLT × PJ), lembretes e uma camada de gamificação com tema RPG. Interface em português.

<details><summary>🇺🇸 English</summary>

FastAPI backend and Next.js frontend with calculators (INSS, IRPF income tax, MEI, CLT vs PJ comparison), reminders and an RPG-themed gamification layer. UI in Brazilian Portuguese.
</details>

## ✨ Funcionalidades · Features

- Calculadoras: INSS, IRPF, MEI, CLT × PJ / *Calculators*
- Lembretes / *Reminders*
- Usuários e gamificação (conquistas) / *Users and gamification (achievements)*
- Health check `GET /`

## 🧰 Stack

**Backend:** Python · FastAPI · Uvicorn · SQLAlchemy 2 · PyMySQL · Pydantic 2 · bcrypt · python-dotenv  
**Frontend:** Next.js 14 · React 18 · Tailwind CSS  
**Banco / DB:** MySQL (`sql/` com schema e migrations)

## 🧱 Arquitetura · Architecture

```
backend/
├── main.py                 # app FastAPI + CORS
└── app/
    ├── api/v1/             # calculadoras, gamificacao, lembretes, usuarios
    ├── core/database.py
    ├── models/ · schemas/
    └── services/           # calculo_inss, calculo_irpf, calculo_mei, comparador_clt_pj, gamificacao_service
frontend/src/               # app/ (layout, page), components/, services/api.js
sql/                        # schema.sql + migrations/
```

## 🚀 Como executar · How to run

Pré-requisitos / Prerequisites: Python 3.10+, Node.js 18+, MySQL.

```bash
git clone https://github.com/ThomasRhoden/inicio-responsavel.git
cd inicio-responsavel
cp .env.example .env        # preencha DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
```

Banco / Database: com o `.env` preenchido, rode `python backend/scripts/migrate.py` (aplica `sql/migrations/` em ordem alfabética; detalhes em [sql/README.md](./sql/README.md)) / with `.env` set, run the migration script (see sql/README.md).

**Backend**
```bash
python -m venv backend/venv
source backend/venv/bin/activate     # Windows: backend\venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn main:app --app-dir backend --reload --port 8000
# http://127.0.0.1:8000  ·  docs: http://127.0.0.1:8000/docs
```

**Frontend**
```bash
cd frontend
npm install
npm run dev -- --port 3000     # http://127.0.0.1:3000
```

## ✅ Testes manuais · Manual checks

`GET /` → status ok · `GET /gamificacao/1` → dados de gamificação · `GET /lembretes` → lista de lembretes · `npm run build` compila. Script auxiliar: `backend/scripts/test_requests.py`.

## 📍 Status

Descontinuado, mantido como portfólio / Discontinued, kept as portfolio. Últimos itens pendentes quando foi pausado: avatar RPG e teste dos fluxos de lembretes, cadastro e simulação CLT/MEI. Histórico em [CHANGELOG.md](./CHANGELOG.md); escopo em [escopo_v0.2.md](./escopo_v0.2.md).

## 👤 Autor · Author

**Thomas Rhoden Gonçalves** — Suporte de TI que programa e usa IA / IT support who codes and uses AI  
✉️ rhodenthomas@gmail.com · [github.com/ThomasRhoden](https://github.com/ThomasRhoden)
