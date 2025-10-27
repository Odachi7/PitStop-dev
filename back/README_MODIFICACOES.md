# Modificações do Sistema PitStop

### 1. 🔐 Senhas em Texto Plano
- **Antes**: Senhas eram armazenadas como hash usando bcrypt
- **Agora**: Senhas são armazenadas em texto plano no banco de dados
- **Arquivos modificados**:
  - `src/core/entities/User.ts`
  - `src/core/entities/Client.ts`
  - `src/application/services/AuthService.ts`
  - `src/application/services/AuthServiceMultiTenant.ts`
  - `src/infrastructure/database/postgres/repositories/UserRepository.ts`
  - `src/infrastructure/database/postgres/repositories/ClienteRepository.ts`

### 2. 👑 Sistema de Super Admins
- **Novo**: Adicionado role `super_admin` com permissões totais
- **Roles disponíveis**: `super_admin`, `admin`, `manager`, `user`
- **Funcionalidades do Super Admin**:
  - Acesso a todas as empresas
  - Gerenciamento de todos os usuários
  - Permissões administrativas totais
- **Arquivos modificados**:
  - `src/core/entities/User.ts` (novos métodos de permissão)
  - `scripts/create-super-admin.ts` (script para criar super admin)

### 3. 🔢 IDs Numéricos para Veículos
- **Antes**: IDs dos veículos eram UUIDs
- **Agora**: IDs dos veículos são números sequenciais (SERIAL)
- **Arquivos modificados**:
  - `src/core/entities/VehicleMultiTenant.ts`
  - `src/core/repositories/IVehicleMultiTenantRepository.ts`
  - `src/infrastructure/database/postgres/repositories/VehicleMultiTenantRepository.ts`
  - Migrations de banco de dados

## 🚀 Como Aplicar as Modificações

### 1. Executar Migrations
```bash
cd back
npm run setup-system
```

Este comando irá:
- Executar todas as migrations necessárias
- Criar um super admin padrão
- Configurar a estrutura do banco

### 2. Credenciais do Super Admin
Após executar o setup, você terá acesso ao super admin:
- **Email**: `admin@pitstop.com`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere a senha padrão após o primeiro login!

### 3. Scripts Disponíveis

```bash
# Configurar sistema completo
npm run setup-system

# Apenas executar migrations
npm run run-migrations

# Apenas criar super admin
npm run create-super-admin

# Desenvolvimento
npm run dev
```

## 📊 Estrutura do Banco Atualizada

### Tabela `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- Senha em texto plano
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- super_admin, admin, manager, user
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela `vehicles` (por cliente)
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY, -- ID numérico sequencial
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  -- ... outros campos
);
```

## 🔧 Funcionalidades do Super Admin

### Métodos Disponíveis na Entidade User
```typescript
// Verificar se é super admin
user.isSuperAdmin(): boolean

// Verificar se pode acessar todas as empresas
user.canAccessAllCompanies(): boolean

// Verificar se pode gerenciar todos os usuários
user.canManageAllUsers(): boolean

// Verificar se pode gerenciar usuários (inclui super_admin)
user.canManageUsers(): boolean
```

## ⚠️ Considerações de Segurança

1. **Senhas em Texto Plano**: 
   - As senhas agora são armazenadas sem criptografia
   - Considere implementar criptografia adicional se necessário
   - Mantenha o banco de dados seguro

2. **Super Admin**:
   - Use com cuidado - tem acesso total ao sistema
   - Altere a senha padrão imediatamente
   - Monitore o uso desta conta

3. **IDs Numéricos**:
   - Mais fáceis de usar e referenciar
   - Sequenciais e previsíveis
   - Considere se isso atende aos requisitos de segurança

## 🐛 Solução de Problemas

### Erro de Migration
Se houver erro ao executar as migrations:
```bash
# Verificar conexão com banco
npm run setup-db

# Executar migrations individualmente
npm run run-migrations
```

### Erro de Permissões
Se o super admin não conseguir acessar:
1. Verifique se o usuário foi criado corretamente
2. Confirme se o role está definido como `super_admin`
3. Verifique os logs do sistema

### Problemas com IDs de Veículos
Se houver problemas com IDs numéricos:
1. Verifique se a migration foi executada
2. Confirme se a tabela foi recriada com SERIAL
3. Verifique se os repositórios foram atualizados

## 📝 Próximos Passos

1. Teste todas as funcionalidades
2. Altere a senha do super admin
3. Configure usuários de teste
4. Monitore o sistema em produção
5. Considere implementar logs de auditoria para o super admin
