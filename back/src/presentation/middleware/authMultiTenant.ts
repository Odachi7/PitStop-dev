import { Request, Response, NextFunction } from 'express';
import { AuthServiceMultiTenant } from '../../application/services/AuthServiceMultiTenant';
import { UserRepository } from '../../infrastructure/database/postgres/repositories/UserRepository';
import { CompanyRepository } from '../../infrastructure/database/postgres/repositories/CompanyRepository';
import { UserSessionRepository } from '../../infrastructure/database/postgres/repositories/UserSessionRepository';
import { mainPool } from '../../shared/config/database.config';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    companyId: string;
    email: string;
    role: string;
    databaseName: string;
    subscriptionPlan: string;
  };
}

const authService = new AuthServiceMultiTenant(
  new UserRepository(mainPool),
  new CompanyRepository(mainPool),
  new UserSessionRepository(mainPool)
);

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token de acesso necessário'
      });
    }

    const user = await authService.validateToken(token);
    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Permissão insuficiente'
      });
    }

    next();
  };
};

export const requireSubscription = (requiredPlans: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuário não autenticado'
      });
    }

    if (!requiredPlans.includes(req.user.subscriptionPlan)) {
      return res.status(403).json({
        success: false,
        error: 'Assinatura insuficiente para acessar este recurso'
      });
    }

    next();
  };
};

export const requireActiveSubscription = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não autenticado'
    });
  }

  // Verificar se a assinatura está ativa
  // Aqui você pode implementar lógica adicional para verificar status da assinatura
  next();
};
