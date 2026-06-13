# Documentação do Marco do Sistema Início Responsável

## 1. Introdução
Este documento marca um ponto de virada no desenvolvimento do sistema `Início Responsável`.
Ele captura o que foi construído, quais escolhas técnicas foram tomadas e como o projeto foi preparado para avançar de uma base funcional para uma experiência mais atraente e resiliente.

## 2. Objetivo do Marco
Transformar o backend e o frontend em um protótipo utilizável que:
- funciona localmente sem depender obrigatoriamente de MySQL;
- traz gamificação básica e persistente para o usuário;
- oferece visualização de progresso, pontos e conquistas;
- documenta o fluxo e os próximos passos para desenvolvimento futuro.

## 3. O que foi feito
### 3.1 Backend
- Adicionado suporte de gamificação persistente com dois novos modelos:
  - `Conquista` — define conquistas do sistema
  - `UsuarioConquista` — registra conquistas concedidas a usuários
- Adicionada coluna `pontos` na tabela `usuarios` para armazenar pontuação cumulativa.
- Criada a lógica de serviço em `backend/app/services/gamificacao_service.py` para:
  - garantir conquistas padrão no banco;
  - conceder conquistas sem duplicatas;
  - atualizar pontos do usuário;
  - recuperar gamificação de forma robusta.
- Integradas as conquistas nas rotas existentes:
  - `POST /lembretes/` agora tenta conceder a conquista `primeiro_lembrete`;
  - `POST /simular/clt` mantém o sistema preparado para ampliar gamificação futura.
- Criado fallback de banco para desenvolvimento:
  - quando `DB_SQLITE` está definido, o app usa `backend/dev.sqlite3`;
  - quando o MySQL falha, o backend tenta automaticamente usar SQLite para evitar erros 500.
- Criado script de migração simples em `backend/scripts/migrate.py`:
  - roda migrações SQL para MySQL;
  - cria tabelas SQLite via SQLAlchemy quando `DB_SQLITE` está ativo.
- Criada migração de consolidação em `sql/migrations/002_finalize_gamificacao.sql`.
- Criado um utilitário de testes E2E em `backend/scripts/test_requests.py` para validar:
  - criação de usuário;
  - leitura de gamificação;
  - simulação CLT;
  - criação de lembrete;
  - atualização de conquistas e pontos.

### 3.2 Frontend
- Atualizado o painel principal para exibir gamificação:
  - pontos acumulados;
  - conquistas desbloqueadas;
  - feedback visual após ações.
- Adicionadas notificações de interface para novas conquistas e atualização de estado.
- Integrado `GET /gamificacao/1` para recuperar o estado do usuário e recarregar após ações.

### 3.3 Documentação e usabilidade
- Criado `sql/README.md` com instruções de migração.
- Criado este documento `Documentação.md` como marco de desenvolvimento.

## 4. Por que estas mudanças são um marco
### 4.1 Resiliência local
Antes, o backend dependia apenas de MySQL. Agora, o projeto roda localmente usando SQLite, permitindo trabalho offline, testes rápidos e validação visual sem configuração de banco pesado.

### 4.2 Gamificação como diferencial
A gamificação introduz um elemento de engajamento que torna o sistema mais "palatável" e menos técnico. Isso cria um contraste entre:
- uma aplicação puramente utilitária;
- um produto que gera progresso visível e recompensa ações do usuário.

### 4.3 Arquitetura simples mas extensível
A implementação é leve, mas abre caminho para:
- badges personalizadas;
- níveis e progressão;
- integração com notificações no frontend;
- tracking de metas financeiras e profissionais.

## 5. Como usar agora
### 5.1 Rodar o backend com SQLite local
```powershell
$env:DB_SQLITE='backend\dev.sqlite3'
py -3.12 -m uvicorn main:app --port 8000 --app-dir backend
```

### 5.2 Aplicar migração no SQLite local
```powershell
$env:DB_SQLITE='backend\dev.sqlite3'
py -3.12 backend\scripts\migrate.py
```

### 5.3 Aplicar migração em MySQL
1. Atualize `.env` com `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
2. Execute:
```powershell
py -3.12 backend\scripts\migrate.py
```

### 5.4 Teste do fluxo básico
```powershell
py -3.12 backend\scripts\test_requests.py
```

## 6. Estado atual do projeto
- Backend funcionando localmente com SQLite.
- Gamificação persistente ativa e integrada nas rotas de lembrete.
- Frontend com visual de pontos e conquistas.
- Migração SQL e scripts de suporte criados.
- Falta apenas:
  - completar testes automáticos end-to-end formais;
  - polir interface visual do frontend;
  - expandir gamificação para mais eventos e níveis.

## 7. Próximos passos recomendados
- adicionar histórico de conquistas no perfil do usuário;
- permitir login e multiusuário real;
- implementar badges baseadas em hábitos financeiros;
- criar dashboard de progresso em etapas;
- adicionar animações e microinterações no frontend.

## 8. Reflexão filosófica
Este marco é mais do que código: é uma mudança de paradigma.
A transformação de um serviço funcional em uma experiência com gamificação é a transição de um aplicativo que responde para um sistema que motiva.
Quando o usuário vê pontos, badges e progresso, o software deixa de ser uma ferramenta fria e passa a ser uma bússola para ações mais responsáveis.

Talvez a maior lição seja esta:
- tecnologia só vira decisão quando oferece sentido;
- design técnico e design emocional devem caminhar juntos;
- um sistema responsável não é só um backend correto, é uma jornada que o usuário consegue perceber.

## 9. Assinatura
Documento criado por Copilot para o marco de desenvolvimento do projeto `Início Responsável`.

---
**Data:** 2026-06-13
**Projeto:** Início Responsável
**Versão do marco:** Gamificação + fallback SQLite + documentação de migração
