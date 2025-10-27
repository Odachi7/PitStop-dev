// Script para executar todas as migrations e configurar o sistema
import { Pool } from 'pg';
import { databaseConfig } from '../src/shared/config/database.config';
import fs from 'fs';
import path from 'path';

const pool = new Pool(databaseConfig.main);

async function runMigration(filePath: string): Promise<void> {
  try {
    console.log(`📁 Lendo arquivo: ${filePath}`);
    const migrationSQL = fs.readFileSync(filePath, 'utf8');
    console.log(`🚀 Executando migration: ${path.basename(filePath)}`);
    await pool.query(migrationSQL);
    console.log(`✅ Migration ${path.basename(filePath)} executada com sucesso\n`);
  } catch (error) {
    console.error(`❌ Erro ao executar migration ${path.basename(filePath)}:`, error);
    throw error;
  }
}

async function runAllMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando execução das migrations...\n');

    // Lista das migrations em ordem
    const migrations = [
      '001_create_clientes_table.sql',
      '002_create_veiculos_tabela.sql',
      '004_create_companies_table.sql',
      '005_create_tenant_vehicles_table.sql',
      '006_create_subscriptions_table.sql',
      '007_update_vehicles_images_structure.sql',
      '008_update_passwords_and_roles.sql'
    ];

    // Executar cada migration
    for (const migration of migrations) {
      const migrationPath = path.join(process.cwd(), 'scripts', 'migrations', migration);
      console.log(`🔍 Verificando: ${migrationPath}`);
      if (fs.existsSync(migrationPath)) {
        await runMigration(migrationPath);
      } else {
        console.log(`⚠️  Migration ${migration} não encontrada em ${migrationPath}, pulando...`);
      }
    }

    console.log('\n🎉 Todas as migrations foram executadas com sucesso!');
    console.log('\n📋 Resumo das mudanças:');
    console.log('• Senhas agora são salvas em texto plano');
    console.log('• Adicionado suporte a super_admin com permissões totais');
    console.log('• IDs dos veículos agora são números sequenciais');
    console.log('• Estrutura multi-tenant configurada');

  } catch (error) {
    console.error('❌ Erro durante a execução das migrations:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar se chamado diretamente
runAllMigrations();

export { runAllMigrations };
