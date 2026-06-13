-- ============================================================
-- INÍCIO RESPONSÁVEL — Schema SQL v0.1
-- Banco de Dados: MySQL 8.0+
-- Descrição: Estrutura relacional do MVP
-- Autor: Thomas Rhoden Gonçalves
-- Data: Junho de 2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS inicio_responsavel
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE inicio_responsavel;

-- ============================================================
-- TABELA: usuarios
-- Descrição: Perfil do cidadão cadastrado na plataforma.
--            Dados sensíveis (renda, área) protegidos via LGPD.
-- ============================================================
CREATE TABLE usuarios (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nome            VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL,
    senha_hash      VARCHAR(255)    NOT NULL,                    -- bcrypt/argon2, nunca texto puro

    -- Situação fiscal atual do usuário (define o nível inicial)
    situacao_atual  ENUM(
                        'DESEMPREGADO',
                        'ESTAGIARIO',
                        'MENOR_APRENDIZ',
                        'CLT',
                        'PJ',
                        'MEI',
                        'ME',
                        'SIMPLES_NACIONAL'
                    ) NOT NULL DEFAULT 'DESEMPREGADO',

    nivel_atual     TINYINT UNSIGNED NOT NULL DEFAULT 0,         -- 0 a 5, espelha a jornada do escopo

    -- Dados financeiros (LGPD: sensíveis — criptografar em camada de aplicação)
    renda_mensal    DECIMAL(10, 2)  NULL,                        -- NULL se desempregado
    area_interesse  VARCHAR(100)    NULL,                        -- Ex: 'tecnologia', 'saúde', 'mecânica'

    ativo           TINYINT(1)      NOT NULL DEFAULT 1,
    criado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uq_usuarios_email UNIQUE (email),

    INDEX idx_usuarios_situacao (situacao_atual),
    INDEX idx_usuarios_nivel (nivel_atual)
) ENGINE=InnoDB COMMENT='Perfil do cidadão cadastrado na plataforma';


-- ============================================================
-- TABELA: tabelas_fiscais
-- Descrição: Faixas e alíquotas dos tributos brasileiros.
--            Estrutura temporal (vigencia_inicio / vigencia_fim)
--            garante que mudanças de governo não quebrem
--            simulações históricas do usuário.
-- ============================================================
CREATE TABLE tabelas_fiscais (
    id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,

    tipo                ENUM(
                            'INSS',
                            'IRPF',
                            'MEI_DAS',
                            'FGTS'
                        ) NOT NULL,

    descricao           VARCHAR(200)    NOT NULL,                -- Ex: 'INSS Empregado — Faixa 1'

    faixa_min           DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
    faixa_max           DECIMAL(10, 2)  NULL,                    -- NULL = sem teto (última faixa)

    aliquota            DECIMAL(5, 4)   NOT NULL,                -- Ex: 0.0750 = 7,5%
    deducao             DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,   -- Parcela a deduzir (IRPF progressivo)

    -- Controle temporal: permite manter histórico de alíquotas antigas
    vigencia_inicio     DATE            NOT NULL,
    vigencia_fim        DATE            NULL,                    -- NULL = vigente até hoje

    criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_tabelas_fiscais PRIMARY KEY (id),

    INDEX idx_fiscal_tipo (tipo),
    INDEX idx_fiscal_vigencia (vigencia_inicio, vigencia_fim)
) ENGINE=InnoDB COMMENT='Faixas e alíquotas dos tributos brasileiros com controle temporal';


-- ============================================================
-- TABELA: simulacoes
-- Descrição: Histórico de simulações realizadas pelo usuário.
--            Parâmetros e resultados em JSON para flexibilidade —
--            cada tipo de simulação tem sua própria estrutura.
-- ============================================================
CREATE TABLE simulacoes (
    id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    usuario_id          INT UNSIGNED    NOT NULL,

    tipo_simulacao      ENUM(
                            'CLT_LIQUIDO',          -- Salário bruto → líquido
                            'CUSTO_EMPREGADOR',     -- Quanto o empregado custa à empresa
                            'CLT_VS_PJ',            -- Comparativo de regimes
                            'MEI_DAS',              -- Faturamento MEI → impostos
                            'TRANSICAO_CLT_PJ'      -- Simulador de transição com reserva
                        ) NOT NULL,

    -- Entrada e saída em JSON — flexível para cada tipo de simulação
    parametros_json     JSON            NOT NULL,               -- Ex: {"salario_bruto": 3500, "dependentes": 1}
    resultado_json      JSON            NOT NULL,               -- Ex: {"liquido": 2980.50, "inss": 280.00}

    criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_simulacoes PRIMARY KEY (id),
    CONSTRAINT fk_simulacoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_simulacoes_usuario (usuario_id),
    INDEX idx_simulacoes_tipo (tipo_simulacao),
    INDEX idx_simulacoes_data (criado_em)
) ENGINE=InnoDB COMMENT='Histórico de simulações fiscais realizadas pelo usuário';


-- ============================================================
-- TABELA: lembretes
-- Descrição: Compromissos e prazos cadastrados pelo usuário.
--            Categorias refletem as três áreas principais
--            da vida fiscal/profissional do cidadão.
-- ============================================================
CREATE TABLE lembretes (
    id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    usuario_id          INT UNSIGNED    NOT NULL,

    titulo              VARCHAR(150)    NOT NULL,
    descricao           TEXT            NULL,

    data_vencimento     DATE            NOT NULL,

    categoria           ENUM(
                            'FISCAL',           -- IR, DAS MEI, IPTU, IPVA
                            'TRABALHISTA',      -- Férias, 13º, rescisão
                            'PESSOAL'           -- Consulta médica, renovação CNH, etc.
                        ) NOT NULL DEFAULT 'PESSOAL',

    prioridade          ENUM(
                            'BAIXA',
                            'MEDIA',
                            'ALTA'
                        ) NOT NULL DEFAULT 'MEDIA',

    concluido           TINYINT(1)      NOT NULL DEFAULT 0,
    criado_em           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_lembretes PRIMARY KEY (id),
    CONSTRAINT fk_lembretes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_lembretes_usuario (usuario_id),
    INDEX idx_lembretes_vencimento (data_vencimento),
    INDEX idx_lembretes_categoria (categoria),
    INDEX idx_lembretes_concluido (concluido)
) ENGINE=InnoDB COMMENT='Compromissos e prazos cadastrados pelo usuário';


-- ============================================================
-- DADOS INICIAIS: tabelas_fiscais
-- Fonte: Receita Federal / Previdência Social — 2025/2026
-- ============================================================

-- INSS Empregado (tabela progressiva 2025)
INSERT INTO tabelas_fiscais (tipo, descricao, faixa_min, faixa_max, aliquota, deducao, vigencia_inicio) VALUES
('INSS', 'INSS Empregado — Faixa 1', 0.00,      1518.00,  0.0750, 0.00, '2025-01-01'),
('INSS', 'INSS Empregado — Faixa 2', 1518.01,   2793.88,  0.0900, 0.00, '2025-01-01'),
('INSS', 'INSS Empregado — Faixa 3', 2793.89,   4190.83,  0.1200, 0.00, '2025-01-01'),
('INSS', 'INSS Empregado — Faixa 4', 4190.84,   8157.41,  0.1400, 0.00, '2025-01-01');

-- IRPF (tabela vigente 2025)
INSERT INTO tabelas_fiscais (tipo, descricao, faixa_min, faixa_max, aliquota, deducao, vigencia_inicio) VALUES
('IRPF', 'IRPF — Isento',           0.00,       2824.00,  0.0000,  0.00,   '2025-01-01'),
('IRPF', 'IRPF — Faixa 7,5%',      2824.01,    3751.05,  0.0750,  211.80, '2025-01-01'),
('IRPF', 'IRPF — Faixa 15%',       3751.06,    4664.68,  0.1500,  493.42, '2025-01-01'),
('IRPF', 'IRPF — Faixa 22,5%',     4664.69,    6101.06,  0.2250,  842.49, '2025-01-01'),
('IRPF', 'IRPF — Faixa 27,5%',     6101.07,    NULL,     0.2750, 1147.49, '2025-01-01');

-- MEI DAS (valores fixos mensais 2025)
INSERT INTO tabelas_fiscais (tipo, descricao, faixa_min, faixa_max, aliquota, deducao, vigencia_inicio) VALUES
('MEI_DAS', 'MEI Comércio/Indústria — DAS mensal', 0.00, 81000.00, 0.0000, 75.90,  '2025-01-01'),
('MEI_DAS', 'MEI Serviços — DAS mensal',           0.00, 81000.00, 0.0000, 80.90,  '2025-01-01'),
('MEI_DAS', 'MEI Comércio+Serviços — DAS mensal',  0.00, 81000.00, 0.0000, 86.90,  '2025-01-01');

-- FGTS (alíquota fixa sobre salário bruto)
INSERT INTO tabelas_fiscais (tipo, descricao, faixa_min, faixa_max, aliquota, deducao, vigencia_inicio) VALUES
('FGTS', 'FGTS — Depósito mensal empregador', 0.00, NULL, 0.0800, 0.00, '2025-01-01');
