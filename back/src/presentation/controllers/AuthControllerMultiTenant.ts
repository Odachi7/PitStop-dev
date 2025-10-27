import { Request, Response } from 'express';
import { AuthServiceMultiTenant, LoginData, RegisterData } from '../../application/services/AuthServiceMultiTenant';
import { UserRepository } from '../../infrastructure/database/postgres/repositories/UserRepository';
import { CompanyRepository } from '../../infrastructure/database/postgres/repositories/CompanyRepository';
import { UserSessionRepository } from '../../infrastructure/database/postgres/repositories/UserSessionRepository';
import { mainPool } from '../../shared/config/database.config';

export class AuthControllerMultiTenant {
  private static authService = new AuthServiceMultiTenant(
    new UserRepository(mainPool),
    new CompanyRepository(mainPool),
    new UserSessionRepository(mainPool)
  );

  static async login(req: Request, res: Response) {
    try {
      const { email, password, companyId } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
      }

      const loginData: LoginData = {
        email,
        password,
        companyId
      };

      const result = await AuthControllerMultiTenant.authService.login(loginData);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, companyId, companyName, companyCnpj } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Email, senha, primeiro nome e último nome são obrigatórios'
        });
      }

      const registerData: RegisterData = {
        email,
        password,
        firstName,
        lastName,
        companyId,
        companyName,
        companyCnpj
      };

      const result = await AuthControllerMultiTenant.authService.register(registerData);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token não fornecido'
        });
      }

      const user = await AuthControllerMultiTenant.authService.validateToken(token);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token não fornecido'
        });
      }

      await AuthControllerMultiTenant.authService.logout(token);
      
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token não fornecido'
        });
      }

      const result = await AuthControllerMultiTenant.authService.refreshToken(token);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  static async cleanExpiredSessions(req: Request, res: Response) {
    try {
      await AuthControllerMultiTenant.authService.cleanExpiredSessions();
      
      res.status(200).json({
        success: true,
        message: 'Sessões expiradas removidas com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
