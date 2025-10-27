-- back/scripts/migrations/002_create_vehicles_table.sql
CREATE TABLE IF NOT EXISTS veiculos (
    id SERIAL PRIMARY KEY, -- ID numérico sequencial
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

-- Índices
CREATE INDEX IF NOT EXISTS idx_veiculos_vendedor_id ON veiculos(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_veiculos_marca ON veiculos(marca);
CREATE INDEX IF NOT EXISTS idx_veiculos_valor ON veiculos(valor);
CREATE INDEX IF NOT EXISTS idx_veiculos_status ON veiculos(status);