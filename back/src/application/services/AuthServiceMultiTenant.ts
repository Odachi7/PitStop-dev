import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../core/entities/User';
import { Company } from '../../core/entities/Company';
import { UserSession } from '../../core/entities/UserSession';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import { ICompanyRepository } from '../../core/repositories/ICompanyRepository';
import { IUserSessionRepository } from '../../core/repositories/IUserSessionRepository';

export interface LoginData {
  email: string;
  password: string;
  companyId?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyId?: string;
  companyName?: string;
  companyCnpj?: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId: string;
    databaseName: string;
    subscriptionPlan: string;
  };
}

export class AuthServiceMultiTenant {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '7d';

  constructor(
    private userRepository: IUserRepository,
    private companyRepository: ICompanyRepository,
    private userSessionRepository: IUserSessionRepository
  ) {}

  async login(loginData: LoginData): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(loginData.email);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar se o usuário pertence à empresa correta (se especificada)
    if (loginData.companyId && user.companyId !== loginData.companyId) {
      throw new Error('Usuário não pertence a esta empresa');
    }

    // Comparação direta da senha em texto plano
    if (loginData.password !== user.password) {
      throw new Error('Credenciais inválidas');
    }

    // Buscar dados da empresa
    const company = await this.companyRepository.findById(user.companyId);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        companyId: user.companyId,
        email: user.email,
        role: user.role 
      },
      AuthServiceMultiTenant.JWT_SECRET,
      { expiresIn: AuthServiceMultiTenant.JWT_EXPIRES_IN }
    );

    // Hash do token para armazenar no banco
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    // Criar sessão
    const session = UserSession.create({
      userId: user.id,
      tokenHash,
      expiresAt
    });

    await this.userSessionRepository.create(session);

    // Atualizar último login
    user.updateLastLogin();
    await this.userRepository.update(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        databaseName: company.databaseName || '',
        subscriptionPlan: company.subscriptionPlan
      }
    };
  }

  async register(registerData: RegisterData): Promise<AuthResult> {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(registerData.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    let company: Company;

    if (registerData.companyId) {
      // Usar empresa existente
      company = await this.companyRepository.findById(registerData.companyId);
      if (!company) {
        throw new Error('Empresa não encontrada');
      }
    } else {
      // Criar nova empresa
      company = Company.create({
        name: registerData.companyName || `${registerData.firstName} ${registerData.lastName}`,
        email: registerData.email,
        cnpj: registerData.companyCnpj,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active'
      });

      company = await this.companyRepository.create(company);
    }

    // Criar usuário com senha em texto plano
    const user = User.create({
      companyId: company.id,
      email: registerData.email,
      password: registerData.password, // Senha em texto plano
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      role: 'admin', // Primeiro usuário da empresa é admin
      isActive: true
    });

    await this.userRepository.create(user);

    // Fazer login automaticamente
    return this.login({
      email: registerData.email,
      password: registerData.password,
      companyId: company.id
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, AuthServiceMultiTenant.JWT_SECRET) as any;
      
      // Buscar todas as sessões do usuário e verificar se alguma corresponde ao token
      const userSessions = await this.userSessionRepository.findByUserId(decoded.userId);
      
      let validSession = null;
      for (const session of userSessions) {
        const isMatch = await bcrypt.compare(token, session.tokenHash);
        if (isMatch) {
          validSession = session;
          break;
        }
      }
      
      if (!validSession) {
        throw new Error('Sessão inválida');
      }

      // Buscar dados do usuário e empresa
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const company = await this.companyRepository.findById(user.companyId);
      if (!company) {
        throw new Error('Empresa não encontrada');
      }

      return {
        userId: decoded.userId,
        companyId: decoded.companyId,
        email: decoded.email,
        role: decoded.role,
        databaseName: company.databaseName,
        subscriptionPlan: company.subscriptionPlan
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const tokenHash = await bcrypt.hash(token, 10);
      const session = await this.userSessionRepository.findByTokenHash(tokenHash);
      
      if (session) {
        await this.userSessionRepository.delete(session.id);
      }
    } catch (error) {
      // Ignorar erros no logout
    }
  }

  async refreshToken(token: string): Promise<AuthResult> {
    const userData = await this.validateToken(token);
    
    // Gerar novo token
    const newToken = jwt.sign(
      { 
        userId: userData.userId, 
        companyId: userData.companyId,
        email: userData.email,
        role: userData.role 
      },
      AuthServiceMultiTenant.JWT_SECRET,
      { expiresIn: AuthServiceMultiTenant.JWT_EXPIRES_IN }
    );

    // Atualizar sessão
    const tokenHash = await bcrypt.hash(token, 10);
    const oldSession = await this.userSessionRepository.findByTokenHash(tokenHash);
    
    if (oldSession) {
      const newTokenHash = await bcrypt.hash(newToken, 10);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const newSession = UserSession.create({
        userId: oldSession.userId,
        tokenHash: newTokenHash,
        expiresAt
      });

      await this.userSessionRepository.delete(oldSession.id);
      await this.userSessionRepository.create(newSession);
    }

    return {
      token: newToken,
      user: userData
    };
  }

  async cleanExpiredSessions(): Promise<void> {
    await this.userSessionRepository.cleanExpiredSessions();
  }
}
