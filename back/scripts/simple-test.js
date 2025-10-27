// Teste simples em JavaScript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pitstop_main',
  password: 'Ryan.0412',
  port: 5434,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function test() {
  try {
    console.log('🔌 Testando conexão...');
    const client = await pool.connect();
    console.log('✅ Conectado!');
    
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Hora:', result.rows[0].now);
    
    client.release();
    await pool.end();
    console.log('✅ Teste concluído!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

test();
