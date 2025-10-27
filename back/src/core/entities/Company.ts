import { Entity } from './base/Entity';

export interface CompanyProps {
  id?: string;
  name: string;
  cnpj?: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  databaseName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Company extends Entity<CompanyProps> {
  private constructor(props: CompanyProps, id?: string) {
    super(props, id);
  }

  static create(props: CompanyProps, id?: string): Company {
    const company = new Company(props, id);
    
    // Validações de negócio
    if (!props.name.trim()) {
      throw new Error('Nome da empresa é obrigatório');
    }
    
    if (!props.email.trim()) {
      throw new Error('Email da empresa é obrigatório');
    }
    
    if (props.cnpj && !this.isValidCNPJ(props.cnpj)) {
      throw new Error('CNPJ inválido');
    }

    // Gerar nome do banco se não fornecido
    if (!props.databaseName) {
      const companyId = id || company.id;
      props.databaseName = `pitstop_client_${companyId.replace(/-/g, '')}`;
    }

    return company;
  }

  private static isValidCNPJ(cnpj: string): boolean {
    // Implementação básica de validação de CNPJ
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14;
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get cnpj(): string | undefined {
    return this.props.cnpj;
  }

  get subscriptionPlan(): string {
    return this.props.subscriptionPlan;
  }

  get subscriptionStatus(): string {
    return this.props.subscriptionStatus;
  }

  get databaseName(): string | undefined {
    return this.props.databaseName;
  }

  // Métodos de negócio
  updateSubscription(plan: string, status: string): void {
    this.props.subscriptionPlan = plan;
    this.props.subscriptionStatus = status;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.subscriptionStatus = 'active';
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.subscriptionStatus = 'inactive';
    this.props.updatedAt = new Date();
  }
}
