import { Pool } from 'pg';
import { User, UserProps } from '../../../../core/entities/User';
import { IUserRepository } from '../../../../core/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT u.*, c.database_name, c.subscription_plan, c.subscription_status
      FROM users u
      JOIN companies c ON u.company_id = c.id
      WHERE u.id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return User.create({
      companyId: row.company_id,
      email: row.email,
      password: row.password, // Senha em texto plano
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT u.*, c.database_name, c.subscription_plan, c.subscription_status
      FROM users u
      JOIN companies c ON u.company_id = c.id
      WHERE u.email = $1 AND u.is_active = true
    `;
    
    const result = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return User.create({
      companyId: row.company_id,
      email: row.email,
      password: row.password, // Senha em texto plano
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async findByCompanyId(companyId: string): Promise<User[]> {
    const query = `
      SELECT u.*, c.database_name, c.subscription_plan, c.subscription_status
      FROM users u
      JOIN companies c ON u.company_id = c.id
      WHERE u.company_id = $1
      ORDER BY u.created_at DESC
    `;
    
    const result = await this.pool.query(query, [companyId]);
    
    return result.rows.map(row => User.create({
      companyId: row.company_id,
      email: row.email,
      password: row.password, // Senha em texto plano
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (
        id, company_id, email, password, first_name, last_name, 
        role, is_active, last_login, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      user.id,
      user.companyId,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.isActive,
      user.lastLogin,
      user.createdAt || new Date(),
      user.updatedAt || new Date()
    ];

    const result = await this.pool.query(query, values);
    return user;
  }

  async update(user: User): Promise<User> {
    const query = `
      UPDATE users SET
        company_id = $2,
        email = $3,
        password = $4,
        first_name = $5,
        last_name = $6,
        role = $7,
        is_active = $8,
        last_login = $9,
        updated_at = $10
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [
      user.id,
      user.companyId,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.isActive,
      user.lastLogin,
      new Date()
    ];

    await this.pool.query(query, values);
    return user;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM users WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  async list(limit: number = 50, offset: number = 0): Promise<User[]> {
    const query = `
      SELECT u.*, c.database_name, c.subscription_plan, c.subscription_status
      FROM users u
      JOIN companies c ON u.company_id = c.id
      ORDER BY u.created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result = await this.pool.query(query, [limit, offset]);
    
    return result.rows.map(row => User.create({
      companyId: row.company_id,
      email: row.email,
      password: row.password, // Senha em texto plano
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }
}
