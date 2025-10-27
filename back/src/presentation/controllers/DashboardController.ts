import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMultiTenant';
import { DashboardService } from '../../application/services/DashboardService';
import { mainPool } from '../../shared/config/database.config';

export class DashboardController {
  private static dashboardService = new DashboardService(mainPool);

  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const stats = await DashboardController.dashboardService.getUserStats(
        req.user.userId, 
        req.user.companyId
      );
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getRecentVehicles(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const vehicles = await DashboardController.dashboardService.getRecentVehicles(
        req.user.userId, 
        req.user.companyId,
        limit
      );
      
      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getVehicleAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { vehicleId } = req.params;
      if (!vehicleId) {
        return res.status(400).json({
          success: false,
          error: 'ID do veículo é obrigatório'
        });
      }

      const analytics = await DashboardController.dashboardService.getVehicleAnalytics(
        req.user.userId,
        vehicleId
      );
      
      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
