import { Router } from 'express';
import { authMultiTenantRoutes } from './authMultiTenant.routes';
import { vehicleMultiTenantRoutes } from './vehicleMultiTenant.routes';
import { dashboardRoutes } from './dashboard.routes';
import { subscriptionRoutes } from './subscription.routes';

const router = Router();

// Rotas de autenticação multi-tenant
router.use('/auth-multi', authMultiTenantRoutes);

// Rotas de veículos multi-tenant
router.use('/vehicles-multi', vehicleMultiTenantRoutes);

// Rotas do dashboard
router.use('/dashboard', dashboardRoutes);

// Rotas de assinaturas
router.use('/subscriptions', subscriptionRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString()
  });
});

export { router };