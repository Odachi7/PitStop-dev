import { Entity } from './base/Entity';

export interface UserProps {
  id?: string;
  companyId: string;
  email: string;
  password: string; // Senha em texto plano
  firstName: string;
  lastName: string;
  role: string; // super_admin, admin, manager, user
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(props: UserProps, id?: string): User {
    const user = new User(props, id);
    
    // Validações de negócio
    if (!props.email.trim()) {
      throw new Error('Email é obrigatório');
    }
    
    if (!this.isValidEmail(props.email)) {
      throw new Error('Email inválido');
    }
    
    if (!props.firstName.trim()) {
      throw new Error('Primeiro nome é obrigatório');
    }
    
    if (!props.lastName.trim()) {
      throw new Error('Último nome é obrigatório');
    }
    
    if (!props.companyId.trim()) {
      throw new Error('ID da empresa é obrigatório');
    }
    
    if (!props.password || !props.password.trim()) {
      throw new Error('Senha é obrigatória');
    }

    const validRoles = ['super_admin', 'admin', 'manager', 'user'];
    if (!validRoles.includes(props.role)) {
      throw new Error('Role inválido');
    }

    return user;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Getters
  get companyId(): string {
    return this.props.companyId;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get role(): string {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get lastLogin(): Date | undefined {
    return this.props.lastLogin;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  // Métodos de negócio
  updateLastLogin(): void {
    this.props.lastLogin = new Date();
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  changeRole(newRole: string): void {
    const validRoles = ['super_admin', 'admin', 'manager', 'user'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Role inválido');
    }
    
    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }

  isSuperAdmin(): boolean {
    return this.props.role === 'super_admin';
  }

  isAdmin(): boolean {
    return this.props.role === 'admin';
  }

  isManager(): boolean {
    return this.props.role === 'manager';
  }

  canManageUsers(): boolean {
    return this.props.role === 'super_admin' || this.props.role === 'admin' || this.props.role === 'manager';
  }

  canAccessAllCompanies(): boolean {
    return this.props.role === 'super_admin';
  }

  canManageAllUsers(): boolean {
    return this.props.role === 'super_admin';
  }
}