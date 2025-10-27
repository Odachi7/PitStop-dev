import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { ClientRepository } from '../../infrastructure/database/postgres/repositories/ClienteRepository';
import { mainPool } from '../../shared/config/database.config';

export class AuthController {
  private static authService = new AuthService(new ClientRepository(mainPool));

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
      }

      const result = await AuthController.authService.login(email, password);

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
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Todos os campos são obrigatórios'
        });
      }

      const result = await AuthController.authService.registrar(
        email, password, firstName, lastName
      );

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

  static async me(req: Request, res: Response) {
    const { id } = req.body;
    
    try {
      // req.user vem do middleware de autenticação
      const client = await AuthController.authService.getClientById(id);

      res.status(200).json({
        success: true,
        data: {
          id: client?.id,
          email: client?.email,
          firstName: client?.primeiroNome,
          lastName: client?.ultimoNome,
          isSeller: client?.vendedor,
          businessName: client?.nomeEmpresarial
        }
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
  }

  static async logout(req: Request, res: Response) {
    // Implementar invalidação de token se necessário
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  }
}