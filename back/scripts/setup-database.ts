import { Pool, Client } from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databaseConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'Ryan.0412',
  port: parseInt(process.env.DB_PORT || '5434'),
};

const mainDatabaseConfig = {
  ...databaseConfig,
  database: process.env.DB_NAME_MAIN || 'pitstop_main',
};

async function createDatabase() {
  const client = new Client({
    ...databaseConfig,
    database: 'postgres' // Conecta ao banco padrão para criar o novo banco
  });

  try {
    await client.connect();
    console.log('🔗 Conectado ao PostgreSQL...');

    // Verificar se o banco já existe
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    const dbExists = await client.query(checkDbQuery, [mainDatabaseConfig.database]);

    if (dbExists.rows.length > 0) {
      console.log(`✅ Banco de dados '${mainDatabaseConfig.database}' já existe`);
    } else {
      // Criar o banco de dados
      await client.query(`CREATE DATABASE ${mainDatabaseConfig.database}`);
      console.log(`✅ Banco de dados '${mainDatabaseConfig.database}' criado com sucesso`);
    }
  } catch (error) {
    console.error('❌ Erro ao criar banco de dados:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function runMigrations() {
  const pool = new Pool(mainDatabaseConfig);

  try {
    console.log('🔄 Iniciando execução das migrações...');

        // Lista de migrações em ordem
        const migrations = [
          '001_create_clientes_table.sql',
          '002_create_veiculos_tabela.sql',
          '003_create_favoritos_tabela.sql',
          '004_create_companies_table.sql',
          '005_create_tenant_vehicles_table.sql',
          '006_create_subscriptions_table.sql',
          '007_update_vehicles_images_structure.sql'
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

async function setupDatabase() {
  try {
    await createDatabase();
    await runMigrations();
    console.log('🚀 Setup do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no setup do banco de dados:', error);
    process.exit(1);
  }
}

setupDatabase();
