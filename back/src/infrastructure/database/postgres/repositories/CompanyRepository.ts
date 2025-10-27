import { Pool } from 'pg';
import { Company, CompanyProps } from '../../../../core/entities/Company';
import { ICompanyRepository } from '../../../../core/repositories/ICompanyRepository';

export class CompanyRepository implements ICompanyRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<Company | null> {
    const query = `
      SELECT * FROM companies 
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Company.create({
      name: row.name,
      cnpj: row.cnpj,
      email: row.email,
      phone: row.phone,
      address: row.address,
      subscriptionPlan: row.subscription_plan,
      subscriptionStatus: row.subscription_status,
      databaseName: row.database_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async findByEmail(email: string): Promise<Company | null> {
    const query = `
      SELECT * FROM companies 
      WHERE email = $1
    `;
    
    const result = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Company.create({
      name: row.name,
      cnpj: row.cnpj,
      email: row.email,
      phone: row.phone,
      address: row.address,
      subscriptionPlan: row.subscription_plan,
      subscriptionStatus: row.subscription_status,
      databaseName: row.database_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const query = `
      SELECT * FROM companies 
      WHERE cnpj = $1
    `;
    
    const result = await this.pool.query(query, [cnpj]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Company.create({
      name: row.name,
      cnpj: row.cnpj,
      email: row.email,
      phone: row.phone,
      address: row.address,
      subscriptionPlan: row.subscription_plan,
      subscriptionStatus: row.subscription_status,
      databaseName: row.database_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async findByDatabaseName(databaseName: string): Promise<Company | null> {
    const query = `
      SELECT * FROM companies 
      WHERE database_name = $1
    `;
    
    const result = await this.pool.query(query, [databaseName]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Company.create({
      name: row.name,
      cnpj: row.cnpj,
      email: row.email,
      phone: row.phone,
      address: row.address,
      subscriptionPlan: row.subscription_plan,
      subscriptionStatus: row.subscription_status,
      databaseName: row.database_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async create(company: Company): Promise<Company> {
    const query = `
      INSERT INTO companies (
        id, name, cnpj, email, phone, address, 
        subscription_plan, subscription_status, database_name, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      company.id,
      company.name,
      company.cnpj,
      company.email,
      company.phone,
      company.address,
      company.subscriptionPlan,
      company.subscriptionStatus,
      company.databaseName,
      company.createdAt || new Date(),
      company.updatedAt || new Date()
    ];

    const result = await this.pool.query(query, values);
    return company;
  }

  async update(company: Company): Promise<Company> {
    const query = `
      UPDATE companies SET
        name = $2,
        cnpj = $3,
        email = $4,
        phone = $5,
        address = $6,
        subscription_plan = $7,
        subscription_status = $8,
        database_name = $9,
        updated_at = $10
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [
      company.id,
      company.name,
      company.cnpj,
      company.email,
      company.phone,
      company.address,
      company.subscriptionPlan,
      company.subscriptionStatus,
      company.databaseName,
      new Date()
    ];

    await this.pool.query(query, values);
    return company;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM companies WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  async list(limit: number = 50, offset: number = 0): Promise<Company[]> {
    const query = `
      SELECT * FROM companies 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result = await this.pool.query(query, [limit, offset]);
    
    return result.rows.map(row => Company.create({
      name: row.name,
      cnpj: row.cnpj,
      email: row.email,
      phone: row.phone,
      address: row.address,
      subscriptionPlan: row.subscription_plan,
      subscriptionStatus: row.subscription_status,
      databaseName: row.database_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }
}
