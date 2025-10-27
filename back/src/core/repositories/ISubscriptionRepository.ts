import { Subscription } from '../entities/Subscription';

export interface ISubscriptionRepository {
  findById(id: string): Promise<Subscription | null>;
  findByCompanyId(companyId: string): Promise<Subscription | null>;
  create(subscription: Subscription): Promise<Subscription>;
  update(subscription: Subscription): Promise<Subscription>;
  delete(id: string): Promise<void>;
  list(limit?: number, offset?: number): Promise<Subscription[]>;
  findExpiringSoon(days: number): Promise<Subscription[]>;
  findExpired(): Promise<Subscription[]>;
}
