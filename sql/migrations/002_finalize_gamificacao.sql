-- Migração 002: Garantir colunas e tabelas de gamificação
-- Esta migração tenta adicionar a coluna `pontos` na tabela `usuarios`
-- e cria as tabelas `conquistas` e `usuario_conquistas` caso não existam.

-- Adiciona coluna pontos se ainda não existir (MySQL 8+ suporta IF NOT EXISTS)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS pontos INT NOT NULL DEFAULT 0;

-- Cria tabela de conquistas
CREATE TABLE IF NOT EXISTS conquistas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chave VARCHAR(50) NOT NULL UNIQUE,
  titulo VARCHAR(120) NOT NULL,
  descricao TEXT NULL,
  pontos INT NOT NULL DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cria tabela associativa usuario_conquistas
CREATE TABLE IF NOT EXISTS usuario_conquistas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  conquista_id INT NOT NULL,
  concedido_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_uc_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_uc_conquista FOREIGN KEY (conquista_id) REFERENCES conquistas(id) ON DELETE CASCADE
);

-- Índices auxiliares
CREATE INDEX IF NOT EXISTS idx_conquistas_chave ON conquistas (chave);
CREATE INDEX IF NOT EXISTS idx_usuario_conquistas_usuario ON usuario_conquistas (usuario_id);
