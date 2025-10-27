import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { User } from './src/core/entities/User';
import { Company } from './src/core/entities/Company';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pitstop_main',
  password: 'Ryan.0412',
  port: 5434,
});

async function debugUser() {
  try {
    console.log('🔍 Debugando criação de usuário...\n');
    
    // 1. Criar empresa primeiro
    console.log('1️⃣ Criando empresa...');
    const company = Company.create({
      name: 'Empresa Debug 2',
      email: 'debug2@empresa.com',
      subscriptionPlan: 'free',
      subscriptionStatus: 'active'
    });
    
    const companyQuery = `
      INSERT INTO companies (id, name, email, subscription_plan, subscription_status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name;
    `;
    
    const companyResult = await pool.query(companyQuery, [
      company.id,
      company.name,
      company.email,
      company.subscriptionPlan,
      company.subscriptionStatus,
      company.createdAt,
      company.updatedAt
    ]);
    
    console.log('✅ Empresa criada:', companyResult.rows[0]);
    
    // 2. Hash da senha
    console.log('\n2️⃣ Criando hash da senha...');
    const passwordHash = await bcrypt.hash('Ryan.0412', 12);
    console.log('✅ Hash criado:', passwordHash.substring(0, 20) + '...');
    
    // 3. Criar usuário
    console.log('\n3️⃣ Criando usuário...');
    const user = User.create({
      companyId: company.id,
      email: 'debug2@usuario.com',
      passwordHash: passwordHash,
      firstName: 'Debug',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });
    
    console.log('✅ Usuário criado na memória');
    console.log('📊 Dados do usuário:');
    console.log('  - ID:', user.id);
    console.log('  - Email:', user.email);
    console.log('  - PasswordHash:', user.passwordHash ? 'DEFINIDO' : 'UNDEFINED');
    console.log('  - CompanyId:', user.companyId);
    console.log('  - FirstName:', user.firstName);
    console.log('  - LastName:', user.lastName);
    console.log('  - Role:', user.role);
    console.log('  - IsActive:', user.isActive);
    
    // 4. Inserir no banco
    console.log('\n4️⃣ Inserindo usuário no banco...');
    const userQuery = `
      INSERT INTO users (
        id, company_id, email, password_hash, first_name, last_name, 
        role, is_active, last_login, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, email, first_name, last_name;
    `;
    
    const userResult = await pool.query(userQuery, [
      user.id,
      user.companyId,
      user.email,
      user.passwordHash,
      user.firstName,
      user.lastName,
      user.role,
      user.isActive,
      user.lastLogin,
      user.createdAt || new Date(),
      user.updatedAt || new Date()
    ]);
    
    console.log('✅ Usuário inserido no banco:', userResult.rows[0]);
    
    // 5. Limpar dados de teste
    console.log('\n5️⃣ Limpando dados de teste...');
    await pool.query('DELETE FROM users WHERE id = $1', [user.id]);
    await pool.query('DELETE FROM companies WHERE id = $1', [company.id]);
    console.log('✅ Dados de teste removidos');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await pool.end();
  }
}

debugUser();
