import { Router } from 'express';
import { AuthControllerMultiTenant } from '../controllers/AuthControllerMultiTenant';
import { authenticateToken, requireRole } from '../middleware/authMultiTenant';

const router = Router();

// Rotas públicas
router.post('/login', AuthControllerMultiTenant.login);
router.post('/register', AuthControllerMultiTenant.register);

// Rotas protegidas
router.get('/validate', authenticateToken, AuthControllerMultiTenant.validateToken);
router.post('/logout', authenticateToken, AuthControllerMultiTenant.logout);
router.post('/refresh', authenticateToken, AuthControllerMultiTenant.refreshToken);

// Rotas administrativas
router.post('/clean-sessions', authenticateToken, requireRole(['admin']), AuthControllerMultiTenant.cleanExpiredSessions);

export { router as authMultiTenantRoutes };
