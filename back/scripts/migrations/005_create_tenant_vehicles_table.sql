-- Estrutura do banco por cliente (será executada dinamicamente)
-- Este arquivo serve como template para criar bancos de clientes

-- Banco: pitstop_client_{company_id}
-- CREATE DATABASE pitstop_client_{company_id};

-- Tabela de veículos (específica do cliente)
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY, -- ID numérico sequencial
  user_id UUID NOT NULL, -- Referência ao usuário do banco principal
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  image1 VARCHAR(500),
  image2 VARCHAR(500),
  image3 VARCHAR(500),
  image4 VARCHAR(500),
  image5 VARCHAR(500),
  image6 VARCHAR(500),
  image7 VARCHAR(500),
  image8 VARCHAR(500),
  mileage INTEGER,
  transmission VARCHAR(50),
  fuel VARCHAR(50),
  category VARCHAR(50) NOT NULL, -- car, motorcycle
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER NOT NULL,
  location VARCHAR(255),
  color VARCHAR(50),
  doors INTEGER,
  engine VARCHAR(100),
  vin VARCHAR(17),
  description TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, sold, inactive
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE, -- Referência ao ID numérico
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vehicle_id ON favorites(vehicle_id);
