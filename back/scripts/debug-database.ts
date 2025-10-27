import { Pool } from 'pg';

async function debugDatabase() {
  console.log('🔍 Debugando conexão com PostgreSQL...\n');
  
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pitstop_main',
    password: 'Ryan.0412',
    port: 5434,
  });

  try {
    // 1. Testar conexão
    console.log('1️⃣ Testando conexão...');
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // 2. Verificar se estamos no banco correto
    console.log('\n2️⃣ Verificando banco atual...');
    const dbResult = await client.query('SELECT current_database()');
    console.log(`📊 Banco atual: ${dbResult.rows[0].current_database}`);
    
    // 3. Listar todos os bancos
    console.log('\n3️⃣ Listando todos os bancos...');
    const databasesResult = await client.query(`
      SELECT datname FROM pg_database 
      WHERE datistemplate = false 
      ORDER BY datname;
    `);
    console.log('📋 Bancos encontrados:');
    databasesResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.datname}`);
    });
    
    // 4. Verificar se o banco pitstop_main existe
    const pitstopExists = databasesResult.rows.some(row => row.datname === 'pitstop_main');
    console.log(`\n🎯 Banco 'pitstop_main' existe: ${pitstopExists ? '✅ SIM' : '❌ NÃO'}`);
    
    // 5. Se existir, listar tabelas
    if (pitstopExists) {
      console.log('\n4️⃣ Listando tabelas no pitstop_main...');
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      
      if (tablesResult.rows.length > 0) {
        console.log('📋 Tabelas encontradas:');
        tablesResult.rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${row.table_name}`);
        });
      } else {
        console.log('❌ Nenhuma tabela encontrada!');
      }
    }
    
    // 6. Verificar schemas
    console.log('\n5️⃣ Verificando schemas...');
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `);
    console.log('📋 Schemas encontrados:');
    schemasResult.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.schema_name}`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await pool.end();
  }
}

debugDatabase();
