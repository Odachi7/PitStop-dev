import { Entity } from './base/Entity';

export interface UserSessionProps {
  id?: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
}

export class UserSession extends Entity<UserSessionProps> {
  private constructor(props: UserSessionProps, id?: string) {
    super(props, id);
  }

  static create(props: UserSessionProps, id?: string): UserSession {
    const session = new UserSession(props, id);
    
    // Validações de negócio
    if (!props.userId.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }
    
    if (!props.tokenHash.trim()) {
      throw new Error('Hash do token é obrigatório');
    }
    
    if (props.expiresAt <= new Date()) {
      throw new Error('Data de expiração deve ser no futuro');
    }

    return session;
  }

  // Getters
  get userId(): string {
    return this.props.userId;
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  // Métodos de negócio
  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  isActive(): boolean {
    return !this.isExpired();
  }

  extendExpiration(minutes: number): void {
    const newExpiration = new Date();
    newExpiration.setMinutes(newExpiration.getMinutes() + minutes);
    this.props.expiresAt = newExpiration;
  }
}
