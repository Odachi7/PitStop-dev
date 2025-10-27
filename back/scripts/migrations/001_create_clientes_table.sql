CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Senha em texto plano
    primeiro_nome VARCHAR(100) NOT NULL,
    ultimo_nome VARCHAR(100) NOT NULL,
    celular VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    codigo_postal VARCHAR(10),
    vendedor BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    razao_social VARCHAR(255),
    cnpj VARCHAR(14),
    cpf VARCHAR(11),
    celular_empresarial VARCHAR(20),
    endereco_empresarial TEXT,
    dt_inc TIMESTAMP DEFAULT NOW(),
    dt_alt TIMESTAMP DEFAULT NOW(),
    ultimo_login TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clients_is_seller ON clientes(vendedor);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clientes(ativo);