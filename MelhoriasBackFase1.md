# 🚀 Guia de Implementação - FASE 1: Fundação

## 📋 Visão Geral da Arquitetura

### 🏗️ **Estratégia de Banco de Dados (Multi-tenant)**

Como senior developer, recomendo uma **arquitetura híbrida multi-tenant**:

#### **1. Banco Principal (Shared Database)**
- **Propósito**: Usuários, autenticação, assinaturas, configurações globais
- **Tabelas**: `users`, `subscriptions`, `companies`, `global_settings`
- **Vantagem**: Facilita gestão centralizada e analytics

#### **2. Bancos por Cliente (Tenant-specific)**
- **Propósito**: Dados específicos de cada cliente (veículos, anúncios, etc.)
- **Estrutura**: `pitstop_client_{company_id}`
- **Vantagem**: Isolamento total, performance, compliance

#### **3. Banco de Cache/Redis**
- **Propósito**: Sessões, cache de busca, rate limiting
- **Vantagem**: Performance e escalabilidade

---

## 🔐 **ETAPA 1: Sistema de Autenticação**

### **1.1 Estrutura do Banco Principal**

```sql
-- Banco: pitstop_main
CREATE DATABASE pitstop_main;

-- Tabela de empresas/clientes
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(20) DEFAULT 'active',
  database_name VARCHAR(100) UNIQUE, -- pitstop_client_{id}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- admin, manager, user
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de sessões
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

### **1.2 Estrutura do Banco por Cliente**

```sql
-- Banco: pitstop_client_{company_id}
CREATE DATABASE pitstop_client_123;

-- Tabela de veículos (específica do cliente)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Referência ao usuário do banco principal
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  images JSONB DEFAULT '[]',
  mileage INTEGER,
  transmission VARCHAR(50),
  fuel VARCHAR(50),
  category VARCHAR(50) NOT NULL, -- car, motorcycle
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER NOT NULL,
  location VARCHAR(255),
  color VARCHAR(50),
  doors INTEGER,
  engine VARCHAR(100),
  vin VARCHAR(17),
  description TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, sold, inactive
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- Índices
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_category ON vehicles(category);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at);
```

### **1.3 Implementação Backend - Autenticação**

#### **1.3.1 Dependências**
```bash
cd back
npm install jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs
```

#### **1.3.2 Schema de Validação**
```typescript
// src/schemas/authSchema.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  companyId: z.string().uuid().optional() // Para multi-tenant
});

export const RegisterSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  companyId: z.string().uuid().optional()
});

export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
```

#### **1.3.3 Repository de Autenticação**
```typescript
// src/repositories/authRepository.ts
import pool from "../database";
import { Pool } from "pg";

export class AuthRepository {
  private static mainPool = pool; // Banco principal
  private static clientPools = new Map<string, Pool>(); // Cache de conexões

  // Obter pool de conexão para cliente específico
  private static async getClientPool(companyId: string): Promise<Pool> {
    if (!this.clientPools.has(companyId)) {
      const clientPool = new Pool({
        user: "postgres",
        host: "localhost",
        database: `pitstop_client_${companyId}`,
        password: "Ryan.0412",
        port: 5432,
      });
      this.clientPools.set(companyId, clientPool);
    }
    return this.clientPools.get(companyId)!;
  }

  // Buscar usuário no banco principal
  static async findUserByEmail(email: string) {
    const query = `
      SELECT u.*, c.database_name, c.subscription_plan, c.subscription_status
      FROM users u
      JOIN companies c ON u.company_id = c.id
      WHERE u.email = $1 AND u.is_active = true
    `;
    const result = await this.mainPool.query(query, [email]);
    return result.rows[0] || null;
  }

  // Criar usuário
  static async createUser(userData: any) {
    const query = `
      INSERT INTO users (company_id, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await this.mainPool.query(query, [
      userData.companyId,
      userData.email,
      userData.passwordHash,
      userData.firstName,
      userData.lastName,
      userData.role || 'user'
    ]);
    return result.rows[0];
  }

  // Criar sessão
  static async createSession(userId: string, tokenHash: string, expiresAt: Date) {
    const query = `
      INSERT INTO user_sessions (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await this.mainPool.query(query, [userId, tokenHash, expiresAt]);
    return result.rows[0];
  }

  // Validar sessão
  static async validateSession(tokenHash: string) {
    const query = `
      SELECT s.*, u.*, c.database_name, c.subscription_plan
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON u.company_id = c.id
      WHERE s.token_hash = $1 AND s.expires_at > NOW()
    `;
    const result = await this.mainPool.query(query, [tokenHash]);
    return result.rows[0] || null;
  }

  // Limpar sessões expiradas
  static async cleanExpiredSessions() {
    const query = `DELETE FROM user_sessions WHERE expires_at < NOW()`;
    await this.mainPool.query(query);
  }
}
```

#### **1.3.4 Service de Autenticação**
```typescript
// src/services/authService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/authRepository";
import { LoginData, RegisterData } from "../schemas/authSchema";

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private static readonly JWT_EXPIRES_IN = "7d";

  // Login
  static async login(loginData: LoginData) {
    const user = await AuthRepository.findUserByEmail(loginData.email);
    
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isValidPassword = await bcrypt.compare(loginData.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Credenciais inválidas");
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        companyId: user.company_id,
        email: user.email,
        role: user.role 
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    // Hash do token para armazenar no banco
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    // Salvar sessão
    await AuthRepository.createSession(user.id, tokenHash, expiresAt);

    // Atualizar último login
    await AuthRepository.updateLastLogin(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        companyId: user.company_id,
        databaseName: user.database_name,
        subscriptionPlan: user.subscription_plan
      }
    };
  }

  // Registro
  static async register(registerData: RegisterData) {
    // Verificar se email já existe
    const existingUser = await AuthRepository.findUserByEmail(registerData.email);
    if (existingUser) {
      throw new Error("Email já está em uso");
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(registerData.password, 12);

    // Criar usuário
    const user = await AuthRepository.createUser({
      ...registerData,
      passwordHash
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    };
  }

  // Validar token
  static async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      const session = await AuthRepository.validateSession(token);
      
      if (!session) {
        throw new Error("Sessão inválida");
      }

      return {
        userId: decoded.userId,
        companyId: decoded.companyId,
        email: decoded.email,
        role: decoded.role,
        databaseName: session.database_name,
        subscriptionPlan: session.subscription_plan
      };
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  // Logout
  static async logout(token: string) {
    const tokenHash = await bcrypt.hash(token, 10);
    await AuthRepository.deleteSession(tokenHash);
  }
}
```

#### **1.3.5 Controller de Autenticação**
```typescript
// src/controllers/authController.ts
import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { LoginSchema, RegisterSchema } from "../schemas/authSchema";

export class AuthController {
  // Login
  static async login(req: Request, res: Response) {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: parsed.error.format()
        });
      }

      const result = await AuthService.login(parsed.data);
      
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

  // Registro
  static async register(req: Request, res: Response) {
    try {
      const parsed = RegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: parsed.error.format()
        });
      }

      const result = await AuthService.register(parsed.data);
      
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

  // Validar token
  static async validateToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Token não fornecido"
        });
      }

      const user = await AuthService.validateToken(token);
      
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

  // Logout
  static async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Token não fornecido"
        });
      }

      await AuthService.logout(token);
      
      res.status(200).json({
        success: true,
        message: "Logout realizado com sucesso"
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

#### **1.3.6 Middleware de Autenticação**
```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

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

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token de acesso necessário"
      });
    }

    const user = await AuthService.validateToken(token);
    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: "Token inválido ou expirado"
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Usuário não autenticado"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Permissão insuficiente"
      });
    }

    next();
  };
};
```

#### **1.3.7 Rotas de Autenticação**
```typescript
// src/routes/auth.ts
import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Rotas públicas
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

// Rotas protegidas
router.get("/validate", authenticateToken, AuthController.validateToken);
router.post("/logout", authenticateToken, AuthController.logout);

export { router as authRoutes };
```

### **1.4 Implementação Frontend - Autenticação**

#### **1.4.1 Context de Autenticação**
```typescript
// src/context/authContext.ts
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId: string;
  databaseName: string;
  subscriptionPlan: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3333";

  // Verificar token no localStorage ao carregar
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      validateToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setToken(token);
      } else {
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem("auth_token", data.data.token);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
```

#### **1.4.2 Página de Login**
```typescript
// src/pages/auth/login/index.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { Button } from "../../../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/card";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### **1.5 Configuração de Rotas Protegidas**

```typescript
// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
```

### **1.6 Atualização do App.tsx**

```typescript
// src/App.tsx
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout";
import { Home } from "./pages/home";
import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import { Dashboard } from "./pages/dashboard";
// ... outras importações

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      // ... outras rotas
    ],
  },
]);

export { router };
```

---

## 🎯 **Próximos Passos**

1. **Implementar as estruturas de banco** conforme especificado
2. **Configurar as variáveis de ambiente** (JWT_SECRET, etc.)
3. **Testar a autenticação** com Postman/Insomnia
4. **Implementar as páginas de login/registro** no frontend
5. **Configurar as rotas protegidas**

### **Comandos para Executar**

```bash
# Backend
cd back
npm install jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs
npm run dev

# Frontend
cd Front
npm run dev
```

### **Variáveis de Ambiente (.env)**
```env
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Ryan.0412
DB_NAME_MAIN=pitstop_main
```

Esta implementação fornece uma base sólida e escalável para o sistema de autenticação multi-tenant, seguindo as melhores práticas de segurança e arquitetura.
