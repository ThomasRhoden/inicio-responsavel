Migrações SQL

Coloque arquivos .sql ordenados (por prefixo numérico) em `sql/migrations/`.

Uso (MySQL):

```powershell
# Usa variáveis do .env para conectar ao MySQL
py -3.12 backend\scripts\migrate.py
```

Uso (desenvolvimento local com SQLite):

```powershell
# cria tabelas pelo SQLAlchemy usando DB_SQLITE
$env:DB_SQLITE='backend\\dev.sqlite3'
py -3.12 backend\scripts\migrate.py
```

Observações:
- A migração 002 tenta usar `IF NOT EXISTS` para evitar falhas em instalações MySQL 8+. Se o seu MySQL for mais antigo, revise o arquivo antes de aplicar.
- O script `backend/scripts/migrate.py` aplica os arquivos em ordem alfabética.
