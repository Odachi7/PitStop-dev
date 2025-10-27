import { Pool } from 'pg';
import { Subscription, SubscriptionProps } from '../../../../core/entities/Subscription';
import { ISubscriptionRepository } from '../../../../core/repositories/ISubscriptionRepository';

export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private pool: Pool) {}

  async findById(id: string): Promise<Subscription | null> {
    const query = `
      SELECT * FROM subscriptions 
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Subscription.create({
      companyId: row.company_id,
      planId: row.plan_id,
      status: row.status,
      currentPeriodStart: row.current_period_start,
      currentPeriodEnd: row.current_period_end,
      cancelAtPeriodEnd: row.cancel_at_period_end,
      trialStart: row.trial_start,
      trialEnd: row.trial_end,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    const query = `
      SELECT * FROM subscriptions 
      WHERE company_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [companyId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return Subscription.create({
      companyId: row.company_id,
      planId: row.plan_id,
      status: row.status,
      currentPeriodStart: row.current_period_start,
      currentPeriodEnd: row.current_period_end,
      cancelAtPeriodEnd: row.cancel_at_period_end,
      trialStart: row.trial_start,
      trialEnd: row.trial_end,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async create(subscription: Subscription): Promise<Subscription> {
    const query = `
      INSERT INTO subscriptions (
        id, company_id, plan_id, status, current_period_start, 
        current_period_end, cancel_at_period_end, trial_start, 
        trial_end, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      subscription.id,
      subscription.companyId,
      subscription.planId,
      subscription.status,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd,
      subscription.cancelAtPeriodEnd,
      subscription.trialStart,
      subscription.trialEnd,
      subscription.createdAt || new Date(),
      subscription.updatedAt || new Date()
    ];

    const result = await this.pool.query(query, values);
    return subscription;
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const query = `
      UPDATE subscriptions SET
        company_id = $2,
        plan_id = $3,
        status = $4,
        current_period_start = $5,
        current_period_end = $6,
        cancel_at_period_end = $7,
        trial_start = $8,
        trial_end = $9,
        updated_at = $10
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [
      subscription.id,
      subscription.companyId,
      subscription.planId,
      subscription.status,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd,
      subscription.cancelAtPeriodEnd,
      subscription.trialStart,
      subscription.trialEnd,
      new Date()
    ];

    await this.pool.query(query, values);
    return subscription;
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM subscriptions WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  async list(limit: number = 50, offset: number = 0): Promise<Subscription[]> {
    const query = `
      SELECT * FROM subscriptions 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result = await this.pool.query(query, [limit, offset]);
    
    return result.rows.map(row => Subscription.create({
      companyId: row.company_id,
      planId: row.plan_id,
      status: row.status,
      currentPeriodStart: row.current_period_start,
      currentPeriodEnd: row.current_period_end,
      cancelAtPeriodEnd: row.cancel_at_period_end,
      trialStart: row.trial_start,
      trialEnd: row.trial_end,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async findExpiringSoon(days: number): Promise<Subscription[]> {
    const query = `
      SELECT * FROM subscriptions 
      WHERE status = 'active' 
      AND current_period_end BETWEEN NOW() AND NOW() + INTERVAL '${days} days'
      ORDER BY current_period_end ASC
    `;
    
    const result = await this.pool.query(query);
    
    return result.rows.map(row => Subscription.create({
      companyId: row.company_id,
      planId: row.plan_id,
      status: row.status,
      currentPeriodStart: row.current_period_start,
      currentPeriodEnd: row.current_period_end,
      cancelAtPeriodEnd: row.cancel_at_period_end,
      trialStart: row.trial_start,
      trialEnd: row.trial_end,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async findExpired(): Promise<Subscription[]> {
    const query = `
      SELECT * FROM subscriptions 
      WHERE status = 'active' 
      AND current_period_end < NOW()
      ORDER BY current_period_end ASC
    `;
    
    const result = await this.pool.query(query);
    
    return result.rows.map(row => Subscription.create({
      companyId: row.company_id,
      planId: row.plan_id,
      status: row.status,
      currentPeriodStart: row.current_period_start,
      currentPeriodEnd: row.current_period_end,
      cancelAtPeriodEnd: row.cancel_at_period_end,
      trialStart: row.trial_start,
      trialEnd: row.trial_end,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }
}
