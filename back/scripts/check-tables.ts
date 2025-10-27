import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pitstop_main',
  password: 'Ryan.0412',
  port: 5434,
});

async function checkTables() {
  try {
    console.log('🔍 Verificando tabelas no banco pitstop_main...\n');
    
    // Listar todas as tabelas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const result = await pool.query(tablesQuery);
    
    console.log('📋 Tabelas encontradas:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    console.log(`\n✅ Total de tabelas: ${result.rows.length}`);
    
    // Verificar estrutura de algumas tabelas principais
    const mainTables = ['companies', 'users', 'user_sessions', 'subscriptions', 'clientes', 'veiculos', 'favoritos'];
    
    for (const tableName of mainTables) {
      if (result.rows.some(row => row.table_name === tableName)) {
        console.log(`\n🔍 Estrutura da tabela ${tableName}:`);
        
        const columnsQuery = `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position;
        `;
        
        const columnsResult = await pool.query(columnsQuery, [tableName]);
        
        columnsResult.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
  } finally {
    await pool.end();
  }
}

checkTables();
