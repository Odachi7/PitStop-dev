import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { authenticateToken, requireRole } from '../middleware/authMultiTenant';

const router = Router();

// Rotas públicas
router.get('/plans', SubscriptionController.getPlans);

// Rotas protegidas
router.use(authenticateToken);

// Assinatura atual da empresa
router.get('/current', SubscriptionController.getCurrentSubscription);

// Criar nova assinatura
router.post('/', SubscriptionController.createSubscription);

// Atualizar assinatura
router.put('/:subscriptionId', SubscriptionController.updateSubscription);

// Cancelar assinatura
router.post('/:subscriptionId/cancel', SubscriptionController.cancelSubscription);

// Renovar assinatura
router.post('/:subscriptionId/renew', SubscriptionController.renewSubscription);

// Verificar limites de recursos
router.get('/limits/:resource', SubscriptionController.checkLimits);

export { router as subscriptionRoutes };
