import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const databaseConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME_MAIN || 'pitstop_main',
  password: process.env.DB_PASSWORD || 'Ryan.0412',
  port: parseInt(process.env.DB_PORT || '5434'),
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool(databaseConfig);

async function runMigrations() {
  try {
    console.log('🔄 Iniciando execução das migrações...');

    // Lista de migrações em ordem
    const migrations = [
      '001_create_clientes_table.sql',
      '002_create_veiculos_tabela.sql',
      '003_create_favoritos_tabela.sql',
      '004_create_companies_table.sql',
      '005_create_tenant_vehicles_table.sql',
      '006_create_subscriptions_table.sql'
    ];

    for (const migration of migrations) {
      console.log(`📄 Executando migração: ${migration}`);
      
      const migrationPath = join(__dirname, 'migrations', migration);
      const migrationSQL = readFileSync(migrationPath, 'utf8');
      
      await pool.query(migrationSQL);
      console.log(`✅ Migração ${migration} executada com sucesso`);
    }

    console.log('🎉 Todas as migrações foram executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
