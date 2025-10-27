# 🚀 PitStop Backend - Implementação Multi-Tenant

### ✅ Fase 1 - Sistema de Autenticação Multi-Tenant
- **Entidades**: Company, User, UserSession
- **Repositórios**: CompanyRepository, UserRepository, UserSessionRepository
- **Serviços**: AuthServiceMultiTenant
- **Controllers**: AuthControllerMultiTenant
- **Middleware**: authMultiTenant.ts
- **Rotas**: `/api/auth-multi/*`

### ✅ Fase 2 - Funcionalidades Core
- **Dashboard**: DashboardService, DashboardController
- **Assinaturas**: SubscriptionService, SubscriptionController com planos (Free, Basic, Premium, Enterprise)
- **Veículos Multi-Tenant**: VehicleMultiTenantService, VehicleMultiTenantController
- **Rotas**: `/api/dashboard/*`, `/api/subscriptions/*`, `/api/vehicles-multi/*`

## 🗄️ Estrutura do Banco de Dados

### Banco Principal (pitstop_main)
- `companies` - Empresas/clientes
- `users` - Usuários do sistema
- `user_sessions` - Sessões ativas
- `subscriptions` - Assinaturas das empresas

### Bancos por Cliente (pitstop_client_{company_id})
- `vehicles` - Veículos específicos de cada cliente
- `favorites` - Favoritos dos usuários

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd back
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto `back/`:
```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=Ryan.0412
DB_NAME_MAIN=pitstop_main

# Configurações JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Configurações do Servidor
PORT=3333
NODE_ENV=development
```

### 3. Executar Migrações
```bash
npm run migrate
```

### 4. Iniciar o Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Endpoints Disponíveis

### Autenticação Multi-Tenant
- `POST /api/auth-multi/login` - Login
- `POST /api/auth-multi/register` - Registro
- `GET /api/auth-multi/validate` - Validar token
- `POST /api/auth-multi/logout` - Logout
- `POST /api/auth-multi/refresh` - Renovar token

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas do usuário
- `GET /api/dashboard/recent-vehicles` - Veículos recentes
- `GET /api/dashboard/vehicle/:id/analytics` - Analytics de veículo

### Assinaturas
- `GET /api/subscriptions/plans` - Listar planos disponíveis
- `GET /api/subscriptions/current` - Assinatura atual
- `POST /api/subscriptions` - Criar assinatura
- `PUT /api/subscriptions/:id` - Atualizar assinatura
- `POST /api/subscriptions/:id/cancel` - Cancelar assinatura
- `GET /api/subscriptions/limits/:resource` - Verificar limites

### Veículos Multi-Tenant
- `GET /api/vehicles-multi/search` - Buscar veículos
- `GET /api/vehicles-multi/featured` - Veículos em destaque
- `GET /api/vehicles-multi/recent` - Veículos recentes
- `GET /api/vehicles-multi/category/:category` - Por categoria
- `GET /api/vehicles-multi/:id` - Detalhes do veículo
- `POST /api/vehicles-multi` - Criar veículo (protegido)
- `PUT /api/vehicles-multi/:id` - Atualizar veículo (protegido)
- `DELETE /api/vehicles-multi/:id` - Excluir veículo (protegido)
- `GET /api/vehicles-multi/user/vehicles` - Meus veículos (protegido)

## 🔧 Funcionalidades Implementadas

### Sistema Multi-Tenant
- Isolamento completo de dados por empresa
- Bancos separados para cada cliente
- Autenticação centralizada com roteamento por empresa

### Sistema de Assinaturas
- 4 planos: Free, Basic, Premium, Enterprise
- Controle de limites por plano
- Gestão de períodos e renovações
- Suporte a trials

### Dashboard Completo
- Estatísticas em tempo real
- Analytics de veículos
- Métricas de performance

### Gestão de Veículos
- CRUD completo
- Upload de múltiplas imagens
- Sistema de busca avançada
- Controle de destaque
- Gestão de status (ativo, vendido, inativo)

## 🛡️ Segurança

- Autenticação JWT com refresh tokens
- Middleware de autorização por roles
- Validação de limites de assinatura
- Isolamento de dados por tenant
- Validação de entrada com Zod

## 📊 Monitoramento

- Logs estruturados com Winston
- Health check endpoint
- Tratamento de erros centralizado
- Rate limiting

## 🔄 Próximos Passos

As próximas fases incluem:
- Sistema de comunicação/chat (Fase 3)
- Analytics avançados (Fase 3)
- Funcionalidades premium (Fase 3)
- Otimizações de performance (Fase 4)
- SEO e marketing (Fase 4)
- Deploy e infraestrutura (Fase 4)

## 🐛 Troubleshooting

### Erro de Conexão com Banco
Verifique se o PostgreSQL está rodando e as credenciais estão corretas no `.env`.

### Erro de Migração
Execute as migrações manualmente se necessário:
```sql
-- Execute os arquivos em scripts/migrations/ na ordem
```

### Erro de JWT
Verifique se a variável `JWT_SECRET` está definida no `.env`.

## 📞 Suporte

Para dúvidas ou problemas, consulte os logs do servidor ou verifique a documentação da API.
