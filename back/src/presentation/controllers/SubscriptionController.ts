import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMultiTenant';
import { SubscriptionService } from '../../application/services/SubscriptionService';
import { SubscriptionRepository } from '../../infrastructure/database/postgres/repositories/SubscriptionRepository';
import { CompanyRepository } from '../../infrastructure/database/postgres/repositories/CompanyRepository';
import { mainPool } from '../../shared/config/database.config';

export class SubscriptionController {
  private static subscriptionService = new SubscriptionService(
    new SubscriptionRepository(mainPool),
    new CompanyRepository(mainPool)
  );

  static async getPlans(req: Request, res: Response) {
    try {
      const plans = await SubscriptionController.subscriptionService.getAvailablePlans();
      
      res.status(200).json({
        success: true,
        data: plans
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getCurrentSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const subscription = await SubscriptionController.subscriptionService.getSubscriptionByCompany(
        req.user.companyId
      );
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async createSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { planId, trialDays } = req.body;

      if (!planId) {
        return res.status(400).json({
          success: false,
          error: 'ID do plano é obrigatório'
        });
      }

      const subscription = await SubscriptionController.subscriptionService.createSubscription({
        companyId: req.user.companyId,
        planId,
        trialDays
      });
      
      res.status(201).json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { subscriptionId } = req.params;
      const { planId, status, cancelAtPeriodEnd } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          error: 'ID da assinatura é obrigatório'
        });
      }

      const subscription = await SubscriptionController.subscriptionService.updateSubscription(
        subscriptionId,
        { planId, status, cancelAtPeriodEnd }
      );
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async cancelSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { subscriptionId } = req.params;
      const { cancelAtPeriodEnd } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          error: 'ID da assinatura é obrigatório'
        });
      }

      const subscription = await SubscriptionController.subscriptionService.cancelSubscription(
        subscriptionId,
        cancelAtPeriodEnd !== false
      );
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async renewSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { subscriptionId } = req.params;

      if (!subscriptionId) {
        return res.status(400).json({
          success: false,
          error: 'ID da assinatura é obrigatório'
        });
      }

      const subscription = await SubscriptionController.subscriptionService.renewSubscription(
        subscriptionId
      );
      
      res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async checkLimits(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { resource } = req.params;

      if (!['vehicles', 'images', 'views'].includes(resource)) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de recurso inválido'
        });
      }

      const limits = await SubscriptionController.subscriptionService.checkSubscriptionLimits(
        req.user.companyId,
        resource as 'vehicles' | 'images' | 'views'
      );
      
      res.status(200).json({
        success: true,
        data: limits
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
