// Script para criar um super admin inicial
import { Pool } from 'pg';
import { databaseConfig } from '../src/shared/config/database.config';

const pool = new Pool(databaseConfig.main);

async function createSuperAdmin() {
  const client = await pool.connect();
  
  try {
    // Verificar se já existe um super admin
    const existingSuperAdmin = await client.query(
      'SELECT id FROM users WHERE role = $1 LIMIT 1',
      ['super_admin']
    );

    if (existingSuperAdmin.rows.length > 0) {
      console.log('Super admin já existe no sistema');
      return;
    }

    // Criar empresa padrão para super admin
    const companyResult = await client.query(`
      INSERT INTO companies (name, email, subscription_plan, subscription_status, database_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [
      'Sistema PitStop',
      'admin@pitstop.com',
      'enterprise',
      'active',
      'pitstop_system'
    ]);

    const companyId = companyResult.rows[0].id;

    // Criar super admin
    const userResult = await client.query(`
      INSERT INTO users (company_id, email, password, first_name, last_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      companyId,
      'admin@pitstop.com',
      'admin123', // Senha padrão - deve ser alterada
      'Super',
      'Admin',
      'super_admin',
      true
    ]);

    const userId = userResult.rows[0].id;

    console.log('Super admin criado com sucesso!');
    console.log('Email: admin@pitstop.com');
    console.log('Senha: admin123');
    console.log('ID do usuário:', userId);
    console.log('ID da empresa:', companyId);
    console.log('\n⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!');

  } catch (error) {
    console.error('Erro ao criar super admin:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar se chamado diretamente
createSuperAdmin();

export { createSuperAdmin };
