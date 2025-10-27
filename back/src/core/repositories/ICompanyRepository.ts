import { Company } from '../entities/Company';

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  findByEmail(email: string): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  findByDatabaseName(databaseName: string): Promise<Company | null>;
  create(company: Company): Promise<Company>;
  update(company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
  list(limit?: number, offset?: number): Promise<Company[]>;
}
