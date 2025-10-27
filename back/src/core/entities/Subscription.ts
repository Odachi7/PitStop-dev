import { Entity } from './base/Entity';

export interface SubscriptionProps {
  id?: string;
  companyId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Subscription extends Entity<SubscriptionProps> {
  private constructor(props: SubscriptionProps, id?: string) {
    super(props, id);
  }

  static create(props: SubscriptionProps, id?: string): Subscription {
    const subscription = new Subscription(props, id);
    
    // Validações de negócio
    if (!props.companyId.trim()) {
      throw new Error('ID da empresa é obrigatório');
    }
    
    if (!props.planId.trim()) {
      throw new Error('ID do plano é obrigatório');
    }

    const validStatuses = ['active', 'inactive', 'cancelled', 'past_due'];
    if (!validStatuses.includes(props.status)) {
      throw new Error('Status da assinatura inválido');
    }

    if (props.currentPeriodEnd <= props.currentPeriodStart) {
      throw new Error('Período de assinatura inválido');
    }

    return subscription;
  }

  // Getters
  get companyId(): string {
    return this.props.companyId;
  }

  get planId(): string {
    return this.props.planId;
  }

  get status(): string {
    return this.props.status;
  }

  get currentPeriodStart(): Date {
    return this.props.currentPeriodStart;
  }

  get currentPeriodEnd(): Date {
    return this.props.currentPeriodEnd;
  }

  get cancelAtPeriodEnd(): boolean {
    return this.props.cancelAtPeriodEnd;
  }

  get trialStart(): Date | undefined {
    return this.props.trialStart;
  }

  get trialEnd(): Date | undefined {
    return this.props.trialEnd;
  }

  // Métodos de negócio
  activate(): void {
    this.props.status = 'active';
    this.props.updatedAt = new Date();
  }

  cancel(): void {
    this.props.status = 'cancelled';
    this.props.updatedAt = new Date();
  }

  markPastDue(): void {
    this.props.status = 'past_due';
    this.props.updatedAt = new Date();
  }

  renew(newPeriodEnd: Date): void {
    this.props.currentPeriodStart = this.props.currentPeriodEnd;
    this.props.currentPeriodEnd = newPeriodEnd;
    this.props.status = 'active';
    this.props.updatedAt = new Date();
  }

  setCancelAtPeriodEnd(cancel: boolean): void {
    this.props.cancelAtPeriodEnd = cancel;
    this.props.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.props.status === 'active';
  }

  isTrial(): boolean {
    if (!this.props.trialStart || !this.props.trialEnd) {
      return false;
    }
    const now = new Date();
    return now >= this.props.trialStart && now <= this.props.trialEnd;
  }

  isExpired(): boolean {
    return new Date() > this.props.currentPeriodEnd;
  }

  daysUntilExpiration(): number {
    const now = new Date();
    const diffTime = this.props.currentPeriodEnd.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
