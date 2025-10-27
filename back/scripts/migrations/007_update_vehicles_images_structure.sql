-- Migração para atualizar estrutura de imagens na tabela vehicles
-- Adiciona campos individuais image1-image8 se não existirem

-- Adicionar novos campos de imagem
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS image1 VARCHAR(500),
ADD COLUMN IF NOT EXISTS image2 VARCHAR(500),
ADD COLUMN IF NOT EXISTS image3 VARCHAR(500),
ADD COLUMN IF NOT EXISTS image4 VARCHAR(500),
ADD COLUMN IF NOT EXISTS image5 VARCHAR(500),
ADD COLUMN IF NOT EXISTS image6 VARCHAR(500),
ADD COLUMN IF NOT EXISTS image7 VARCHAR(500),
ADD COLUMN IF NOT EXISTS image8 VARCHAR(500);

-- Verificar se existe coluna images e migrar dados se necessário
DO $$
BEGIN
    -- Verificar se a coluna images existe
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vehicles' 
        AND column_name = 'images'
    ) THEN
        -- Migrar dados existentes do campo images para os novos campos
        UPDATE vehicles 
        SET 
          image1 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 0 THEN images->0->>'url' ELSE NULL END,
          image2 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 1 THEN images->1->>'url' ELSE NULL END,
          image3 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 2 THEN images->2->>'url' ELSE NULL END,
          image4 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 3 THEN images->3->>'url' ELSE NULL END,
          image5 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 4 THEN images->4->>'url' ELSE NULL END,
          image6 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 5 THEN images->5->>'url' ELSE NULL END,
          image7 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 6 THEN images->6->>'url' ELSE NULL END,
          image8 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 7 THEN images->7->>'url' ELSE NULL END
        WHERE images IS NOT NULL AND images != '[]'::jsonb;

        -- Se o campo images contém strings diretas (não objetos com url)
        UPDATE vehicles 
        SET 
          image1 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 0 THEN images->>0 ELSE NULL END,
          image2 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 1 THEN images->>1 ELSE NULL END,
          image3 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 2 THEN images->>2 ELSE NULL END,
          image4 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 3 THEN images->>3 ELSE NULL END,
          image5 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 4 THEN images->>4 ELSE NULL END,
          image6 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 5 THEN images->>5 ELSE NULL END,
          image7 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 6 THEN images->>6 ELSE NULL END,
          image8 = CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 7 THEN images->>7 ELSE NULL END
        WHERE images IS NOT NULL 
          AND images != '[]'::jsonb 
          AND jsonb_typeof(images->0) = 'string';

        -- Remover o campo images antigo
        ALTER TABLE vehicles DROP COLUMN IF EXISTS images;
    END IF;
END $$;
