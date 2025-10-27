import { Request, Response, NextFunction } from 'express';
import { logger } from '../../shared/utils/logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Erro na aplicação:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Se for um erro de validação
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: error.message,
    });
  }

  // Se for um erro de autenticação
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    });
  }

  // Se for um erro de permissão
  if (error.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      error: 'Permissão insuficiente',
    });
  }

  // Se for um erro de recurso não encontrado
  if (error.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      error: 'Recurso não encontrado',
    });
  }

  // Erro genérico do servidor
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { details: error.message }),
  });
};
