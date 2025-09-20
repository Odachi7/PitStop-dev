-- back/scripts/migrations/003_create_favorites_table.sql
CREATE TABLE IF NOT EXISTS favoritos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
    dt_inc TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(cliente_id, veiculo_id)
);