import { Subscription } from '../../core/entities/Subscription';
import { ISubscriptionRepository } from '../../core/repositories/ISubscriptionRepository';
import { ICompanyRepository } from '../../core/repositories/ICompanyRepository';
import { SUBSCRIPTION_PLANS, getPlanById } from '../../shared/constants/subscriptionPlans';

export interface CreateSubscriptionData {
  companyId: string;
  planId: string;
  trialDays?: number;
}

export interface UpdateSubscriptionData {
  planId?: string;
  status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
  cancelAtPeriodEnd?: boolean;
}

export class SubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private companyRepository: ICompanyRepository
  ) {}

  async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    // Verificar se o plano existe
    const plan = getPlanById(data.planId);
    if (!plan) {
      throw new Error('Plano de assinatura não encontrado');
    }

    // Verificar se a empresa já tem uma assinatura ativa
    const existingSubscription = await this.subscriptionRepository.findByCompanyId(data.companyId);
    if (existingSubscription && existingSubscription.isActive()) {
      throw new Error('Empresa já possui uma assinatura ativa');
    }

    // Calcular datas do período
    const now = new Date();
    const periodEnd = new Date();
    
    if (plan.interval === 'month') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Configurar período de trial se especificado
    let trialStart: Date | undefined;
    let trialEnd: Date | undefined;
    
    if (data.trialDays && data.trialDays > 0) {
      trialStart = now;
      trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + data.trialDays);
    }

    // Criar assinatura
    const subscription = Subscription.create({
      companyId: data.companyId,
      planId: data.planId,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
      trialStart,
      trialEnd
    });

    const createdSubscription = await this.subscriptionRepository.create(subscription);

    // Atualizar plano da empresa
    const company = await this.companyRepository.findById(data.companyId);
    if (company) {
      company.updateSubscription(data.planId, 'active');
      await this.companyRepository.update(company);
    }

    return createdSubscription;
  }

  async updateSubscription(subscriptionId: string, data: UpdateSubscriptionData): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    // Atualizar plano se especificado
    if (data.planId) {
      const plan = getPlanById(data.planId);
      if (!plan) {
        throw new Error('Plano de assinatura não encontrado');
      }
      subscription.props.planId = data.planId;
    }

    // Atualizar status se especificado
    if (data.status) {
      subscription.props.status = data.status;
    }

    // Atualizar cancelamento no final do período
    if (data.cancelAtPeriodEnd !== undefined) {
      subscription.setCancelAtPeriodEnd(data.cancelAtPeriodEnd);
    }

    subscription.props.updatedAt = new Date();

    const updatedSubscription = await this.subscriptionRepository.update(subscription);

    // Atualizar plano da empresa
    const company = await this.companyRepository.findById(subscription.companyId);
    if (company) {
      company.updateSubscription(subscription.planId, subscription.status);
      await this.companyRepository.update(company);
    }

    return updatedSubscription;
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    if (cancelAtPeriodEnd) {
      subscription.setCancelAtPeriodEnd(true);
    } else {
      subscription.cancel();
    }

    subscription.props.updatedAt = new Date();

    const updatedSubscription = await this.subscriptionRepository.update(subscription);

    // Atualizar status da empresa
    const company = await this.companyRepository.findById(subscription.companyId);
    if (company) {
      company.updateSubscription(subscription.planId, subscription.status);
      await this.companyRepository.update(company);
    }

    return updatedSubscription;
  }

  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    const plan = getPlanById(subscription.planId);
    if (!plan) {
      throw new Error('Plano de assinatura não encontrado');
    }

    // Calcular novo período
    const newPeriodEnd = new Date();
    
    if (plan.interval === 'month') {
      newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
    } else {
      newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
    }

    subscription.renew(newPeriodEnd);
    const updatedSubscription = await this.subscriptionRepository.update(subscription);

    // Atualizar status da empresa
    const company = await this.companyRepository.findById(subscription.companyId);
    if (company) {
      company.updateSubscription(subscription.planId, 'active');
      await this.companyRepository.update(company);
    }

    return updatedSubscription;
  }

  async getSubscriptionByCompany(companyId: string): Promise<Subscription | null> {
    return await this.subscriptionRepository.findByCompanyId(companyId);
  }

  async getSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
    return await this.subscriptionRepository.findById(subscriptionId);
  }

  async getAvailablePlans(): Promise<any[]> {
    return SUBSCRIPTION_PLANS;
  }

  async checkSubscriptionLimits(companyId: string, resource: 'vehicles' | 'images' | 'views'): Promise<{ allowed: boolean; limit: number; current: number }> {
    const subscription = await this.subscriptionRepository.findByCompanyId(companyId);
    if (!subscription) {
      // Usar plano gratuito como padrão
      const freePlan = getPlanById('free');
      let limit: number;
      switch (resource) {
        case 'vehicles':
          limit = freePlan?.features.maxVehicles || 3;
          break;
        case 'images':
          limit = freePlan?.features.maxImages || 8;
          break;
        case 'views':
          limit = freePlan?.limits.monthlyViews || 1000;
          break;
        default:
          throw new Error('Tipo de recurso inválido');
      }
      return {
        allowed: true,
        limit,
        current: 0
      };
    }

    const plan = getPlanById(subscription.planId);
    if (!plan) {
      throw new Error('Plano de assinatura não encontrado');
    }

    let limit: number;
    switch (resource) {
      case 'vehicles':
        limit = plan.features.maxVehicles;
        break;
      case 'images':
        limit = plan.features.maxImages;
        break;
      case 'views':
        limit = plan.limits.monthlyViews;
        break;
      default:
        throw new Error('Tipo de recurso inválido');
    }

    // -1 significa ilimitado
    if (limit === -1) {
      return {
        allowed: true,
        limit: -1,
        current: 0
      };
    }

    // Aqui você implementaria a lógica para contar o uso atual
    // Por simplicidade, retornando 0 como uso atual
    const current = 0;

    return {
      allowed: current < limit,
      limit,
      current
    };
  }

  async processExpiredSubscriptions(): Promise<void> {
    const expiredSubscriptions = await this.subscriptionRepository.findExpired();
    
    for (const subscription of expiredSubscriptions) {
      subscription.markPastDue();
      await this.subscriptionRepository.update(subscription);

      // Atualizar status da empresa
      const company = await this.companyRepository.findById(subscription.companyId);
      if (company) {
        company.updateSubscription(subscription.planId, 'past_due');
        await this.companyRepository.update(company);
      }
    }
  }
}
