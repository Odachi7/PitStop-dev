import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken } from '../middleware/authMultiTenant';

const router = Router();

// Todas as rotas do dashboard requerem autenticação
router.use(authenticateToken);

// Estatísticas gerais do dashboard
router.get('/stats', DashboardController.getStats);

// Veículos recentes do usuário
router.get('/recent-vehicles', DashboardController.getRecentVehicles);

// Analytics de um veículo específico
router.get('/vehicle/:vehicleId/analytics', DashboardController.getVehicleAnalytics);

export { router as dashboardRoutes };
