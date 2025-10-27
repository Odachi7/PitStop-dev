-- Migration para atualizar senhas para texto plano e adicionar suporte a super admins

-- Atualizar tabela de usuários para usar senha em texto plano
ALTER TABLE users 
  DROP COLUMN IF EXISTS password_hash,
  ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';

-- Atualizar tabela de clientes para usar senha em texto plano  
ALTER TABLE clientes 
  DROP COLUMN IF EXISTS senha_hash,
  ADD COLUMN senha VARCHAR(255) NOT NULL DEFAULT '';

-- Atualizar tabela de veículos para usar ID numérico
-- Primeiro, criar nova tabela com estrutura correta
CREATE TABLE IF NOT EXISTS veiculos_new (
    id SERIAL PRIMARY KEY,
    vendedor_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    cor VARCHAR(50),
    quilometragem INTEGER,
    tipo_combustivel VARCHAR(50),
    transmissao VARCHAR(50),
    valor DECIMAL(12,2) NOT NULL,
    moeda VARCHAR(3) DEFAULT 'BRL',
    status VARCHAR(20) DEFAULT 'available',
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_principal VARCHAR(500),
    imagem2 VARCHAR(500),
    imagem3 VARCHAR(500),
    imagem4 VARCHAR(500),
    imagem5 VARCHAR(500),
    imagem6 VARCHAR(500),
    imagem7 VARCHAR(500),
    dt_inc TIMESTAMP DEFAULT NOW(),
    dt_alt TIMESTAMP DEFAULT NOW(),
    dt_public TIMESTAMP
);

-- Copiar dados da tabela antiga para a nova (se existirem dados)
INSERT INTO veiculos_new (
    vendedor_id, marca, modelo, ano, cor, quilometragem, tipo_combustivel,
    transmissao, valor, moeda, status, titulo, descricao, imagem_principal,
    imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, dt_inc, dt_alt, dt_public
)
SELECT 
    vendedor_id, marca, modelo, ano, cor, quilometragem, tipo_combustivel,
    transmissao, valor, moeda, status, titulo, descricao, imagem_principal,
    imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, dt_inc, dt_alt, dt_public
FROM veiculos;

-- Remover tabela antiga e renomear a nova (com CASCADE para remover dependências)
DROP TABLE IF EXISTS veiculos CASCADE;
ALTER TABLE veiculos_new RENAME TO veiculos;

-- Recriar índices
CREATE INDEX IF NOT EXISTS idx_veiculos_vendedor_id ON veiculos(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_veiculos_marca ON veiculos(marca);
CREATE INDEX IF NOT EXISTS idx_veiculos_valor ON veiculos(valor);
CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(status);

-- Adicionar comentários sobre as mudanças
COMMENT ON COLUMN users.password IS 'Senha em texto plano (não hash)';
COMMENT ON COLUMN clientes.senha IS 'Senha em texto plano (não hash)';
COMMENT ON COLUMN veiculos.id IS 'ID numérico sequencial';
COMMENT ON COLUMN users.role IS 'Roles: super_admin, admin, manager, user';
