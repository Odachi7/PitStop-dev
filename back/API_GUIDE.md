# 🚀 Guia Completo da API PitStop

Este guia explica como usar todas as funcionalidades da API do PitStop, incluindo autenticação, gestão de veículos, dashboard e assinaturas.

## 📋 Índice
1. [Autenticação Multi-Tenant](#autenticação-multi-tenant)
2. [Gestão de Veículos](#gestão-de-veículos)
3. [Dashboard](#dashboard)
4. [Sistema de Assinaturas](#sistema-de-assinaturas)
5. [Exemplos Práticos](#exemplos-práticos)

---

## 🔐 Autenticação Multi-Tenant

### 1. Registro de Nova Empresa/Usuário

**POST** `/api/auth-multi/register`

```json
{
  "email": "admin@empresa.com",
  "password": "senha123",
  "firstName": "João",
  "lastName": "Silva",
  "companyName": "Minha Empresa LTDA",
  "role": "admin"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-do-usuario",
    "email": "admin@empresa.com",
    "firstName": "João",
    "lastName": "Silva",
    "role": "admin",
    "companyId": "uuid-da-empresa",
    "companyName": "Minha Empresa LTDA"
  }
}
```

### 2. Login

**POST** `/api/auth-multi/login`

```json
{
  "email": "admin@empresa.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-aqui",
    "user": {
      "id": "uuid-do-usuario",
      "email": "admin@empresa.com",
      "firstName": "João",
      "lastName": "Silva",
      "role": "admin",
      "companyId": "uuid-da-empresa",
      "databaseName": "pitstop_client_uuid",
      "subscriptionPlan": "free"
    }
  }
}
```

### 3. Validar Token

**GET** `/api/auth-multi/validate`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-do-usuario",
    "companyId": "uuid-da-empresa",
    "email": "admin@empresa.com",
    "role": "admin",
    "databaseName": "pitstop_client_uuid",
    "subscriptionPlan": "free"
  }
}
```

### 4. Logout

**POST** `/api/auth-multi/logout`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 🚗 Gestão de Veículos

### 1. Adicionar Novo Veículo

**POST** `/api/vehicles-multi`
**Headers:** `Authorization: Bearer jwt-token-aqui`

```json
{
  "title": "Honda Civic 2020",
  "price": 85000.00,
  "image1": "https://exemplo.com/imagem1.jpg",
  "image2": "https://exemplo.com/imagem2.jpg",
  "image3": "https://exemplo.com/imagem3.jpg",
  "image4": "https://exemplo.com/imagem4.jpg",
  "image5": "https://exemplo.com/imagem5.jpg",
  "image6": "https://exemplo.com/imagem6.jpg",
  "image7": "https://exemplo.com/imagem7.jpg",
  "image8": "https://exemplo.com/imagem8.jpg",
  "mileage": 25000,
  "transmission": "Automático",
  "fuel": "Flex",
  "category": "car",
  "brand": "Honda",
  "model": "Civic",
  "year": 2020,
  "location": "São Paulo, SP",
  "color": "Prata",
  "doors": 4,
  "engine": "1.5 Turbo",
  "vin": "1HGBH41JXMN109186",
  "description": "Veículo em excelente estado, único dono, revisões em dia."
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-do-veiculo",
    "title": "Honda Civic 2020",
    "price": 85000.00,
    "image1": "https://exemplo.com/imagem1.jpg",
    "image2": "https://exemplo.com/imagem2.jpg",
    "image3": "https://exemplo.com/imagem3.jpg",
    "image4": "https://exemplo.com/imagem4.jpg",
    "image5": "https://exemplo.com/imagem5.jpg",
    "image6": "https://exemplo.com/imagem6.jpg",
    "image7": "https://exemplo.com/imagem7.jpg",
    "image8": "https://exemplo.com/imagem8.jpg",
    "mileage": 25000,
    "transmission": "Automático",
    "fuel": "Flex",
    "category": "car",
    "brand": "Honda",
    "model": "Civic",
    "year": 2020,
    "location": "São Paulo, SP",
    "color": "Prata",
    "doors": 4,
    "engine": "1.5 Turbo",
    "vin": "1HGBH41JXMN109186",
    "description": "Veículo em excelente estado...",
    "status": "active",
    "featured": false,
    "viewsCount": 0,
    "createdAt": "2025-09-29T03:08:45.958Z",
    "updatedAt": "2025-09-29T03:08:45.958Z"
  }
}
```

### 2. Listar Veículos

**GET** `/api/vehicles-multi`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Parâmetros de Query (opcionais):**
- `page=1` - Página (padrão: 1)
- `limit=10` - Itens por página (padrão: 10)
- `category=car` - Categoria (car, motorcycle)
- `brand=Honda` - Marca
- `minPrice=50000` - Preço mínimo
- `maxPrice=100000` - Preço máximo
- `year=2020` - Ano
- `location=São Paulo` - Localização
- `search=Honda Civic` - Busca por texto

**Exemplo:**
```
GET /api/vehicles-multi?page=1&limit=5&category=car&brand=Honda&minPrice=50000&maxPrice=100000
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "id": "uuid-do-veiculo",
        "title": "Honda Civic 2020",
        "price": 85000.00,
        "image1": "https://exemplo.com/imagem1.jpg",
    "image2": "https://exemplo.com/imagem2.jpg",
    "image3": "https://exemplo.com/imagem3.jpg",
    "image4": "https://exemplo.com/imagem4.jpg",
    "image5": "https://exemplo.com/imagem5.jpg",
    "image6": "https://exemplo.com/imagem6.jpg",
    "image7": "https://exemplo.com/imagem7.jpg",
    "image8": "https://exemplo.com/imagem8.jpg",
        "brand": "Honda",
        "model": "Civic",
        "year": 2020,
        "location": "São Paulo, SP",
        "status": "active",
        "createdAt": "2025-09-29T03:08:45.958Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### 3. Buscar Veículo por ID

**GET** `/api/vehicles-multi/{id}`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-do-veiculo",
    "title": "Honda Civic 2020",
    "price": 85000.00,
    "image1": "https://exemplo.com/imagem1.jpg",
    "image2": "https://exemplo.com/imagem2.jpg",
    "image3": "https://exemplo.com/imagem3.jpg",
    "image4": "https://exemplo.com/imagem4.jpg",
    "image5": "https://exemplo.com/imagem5.jpg",
    "image6": "https://exemplo.com/imagem6.jpg",
    "image7": "https://exemplo.com/imagem7.jpg",
    "image8": "https://exemplo.com/imagem8.jpg",
    "mileage": 25000,
    "transmission": "Automático",
    "fuel": "Flex",
    "category": "car",
    "brand": "Honda",
    "model": "Civic",
    "year": 2020,
    "location": "São Paulo, SP",
    "color": "Prata",
    "doors": 4,
    "engine": "1.5 Turbo",
    "vin": "1HGBH41JXMN109186",
    "description": "Veículo em excelente estado...",
    "status": "active",
    "featured": false,
    "viewsCount": 0,
    "createdAt": "2025-09-29T03:08:45.958Z",
    "updatedAt": "2025-09-29T03:08:45.958Z"
  }
}
```

### 4. Atualizar Veículo

**PUT** `/api/vehicles-multi/{id}`
**Headers:** `Authorization: Bearer jwt-token-aqui`

```json
{
  "title": "Honda Civic 2020 - Atualizado",
  "price": 82000.00,
  "description": "Preço reduzido! Veículo em excelente estado."
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-do-veiculo",
    "title": "Honda Civic 2020 - Atualizado",
    "price": 82000.00,
    "description": "Preço reduzido! Veículo em excelente estado.",
    "updatedAt": "2025-09-29T03:15:30.123Z"
  }
}
```

### 5. Excluir Veículo

**DELETE** `/api/vehicles-multi/{id}`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "message": "Veículo excluído com sucesso"
}
```

### 6. Adicionar aos Favoritos

**POST** `/api/vehicles-multi/{id}/favorite`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "message": "Veículo adicionado aos favoritos"
}
```

### 7. Remover dos Favoritos

**DELETE** `/api/vehicles-multi/{id}/favorite`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "message": "Veículo removido dos favoritos"
}
```

### 8. Listar Favoritos

**GET** `/api/vehicles-multi/favorites`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-veiculo",
      "title": "Honda Civic 2020",
      "price": 85000.00,
      "image1": "https://exemplo.com/imagem1.jpg",
    "image2": "https://exemplo.com/imagem2.jpg",
    "image3": "https://exemplo.com/imagem3.jpg",
    "image4": "https://exemplo.com/imagem4.jpg",
    "image5": "https://exemplo.com/imagem5.jpg",
    "image6": "https://exemplo.com/imagem6.jpg",
    "image7": "https://exemplo.com/imagem7.jpg",
    "image8": "https://exemplo.com/imagem8.jpg",
      "brand": "Honda",
      "model": "Civic",
      "year": 2020,
      "favoritedAt": "2025-09-29T03:10:15.456Z"
    }
  ]
}
```

---

## 📊 Dashboard

### 1. Estatísticas Gerais

**GET** `/api/dashboard/stats`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "totalVehicles": 15,
    "activeVehicles": 12,
    "soldVehicles": 3,
    "totalViews": 1250,
    "favoritesCount": 45,
    "recentVehicles": [
      {
        "id": "uuid-do-veiculo",
        "title": "Honda Civic 2020",
        "price": 85000.00,
        "createdAt": "2025-09-29T03:08:45.958Z"
      }
    ]
  }
}
```

### 2. Estatísticas por Período

**GET** `/api/dashboard/stats/period?start=2025-09-01&end=2025-09-30`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "vehiclesAdded": 8,
    "vehiclesSold": 2,
    "totalViews": 450,
    "favoritesAdded": 12
  }
}
```

---

## 💳 Sistema de Assinaturas

### 1. Listar Planos Disponíveis

**GET** `/api/subscriptions/plans`

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "free",
      "name": "Gratuito",
      "price": 0,
      "currency": "BRL",
      "interval": "month",
      "features": {
        "maxVehicles": 5,
        "maxImagesPerVehicle": 3,
        "analytics": false,
        "prioritySupport": false
      }
    },
    {
      "id": "basic",
      "name": "Básico",
      "price": 29.90,
      "currency": "BRL",
      "interval": "month",
      "features": {
        "maxVehicles": 50,
        "maxImagesPerVehicle": 10,
        "analytics": true,
        "prioritySupport": false
      }
    },
    {
      "id": "premium",
      "name": "Premium",
      "price": 79.90,
      "currency": "BRL",
      "interval": "month",
      "features": {
        "maxVehicles": 200,
        "maxImagesPerVehicle": 20,
        "analytics": true,
        "prioritySupport": true
      }
    },
    {
      "id": "enterprise",
      "name": "Empresarial",
      "price": 199.90,
      "currency": "BRL",
      "interval": "month",
      "features": {
        "maxVehicles": -1,
        "maxImagesPerVehicle": -1,
        "analytics": true,
        "prioritySupport": true
      }
    }
  ]
}
```

### 2. Obter Assinatura Atual

**GET** `/api/subscriptions/current`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-da-assinatura",
    "planId": "free",
    "status": "active",
    "currentPeriodStart": "2025-09-29T03:08:45.958Z",
    "currentPeriodEnd": "2025-10-29T03:08:45.958Z",
    "trialEnd": null,
    "createdAt": "2025-09-29T03:08:45.958Z"
  }
}
```

### 3. Atualizar Assinatura

**PUT** `/api/subscriptions/current`
**Headers:** `Authorization: Bearer jwt-token-aqui`

```json
{
  "planId": "basic"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-da-assinatura",
    "planId": "basic",
    "status": "active",
    "currentPeriodStart": "2025-09-29T03:15:30.123Z",
    "currentPeriodEnd": "2025-10-29T03:15:30.123Z",
    "trialEnd": null,
    "createdAt": "2025-09-29T03:08:45.958Z"
  }
}
```

### 4. Cancelar Assinatura

**DELETE** `/api/subscriptions/current`
**Headers:** `Authorization: Bearer jwt-token-aqui`

**Resposta:**
```json
{
  "success": true,
  "message": "Assinatura cancelada com sucesso"
}
```

---

## 🛠️ Exemplos Práticos

### Exemplo 1: Fluxo Completo de Venda

1. **Registrar empresa e usuário:**
```bash
curl -X POST http://localhost:3333/api/auth-multi/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@minhaempresa.com",
    "password": "senha123",
    "firstName": "João",
    "lastName": "Silva",
    "companyName": "Minha Empresa LTDA",
    "role": "admin"
  }'
```

2. **Fazer login:**
```bash
curl -X POST http://localhost:3333/api/auth-multi/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@minhaempresa.com",
    "password": "senha123"
  }'
```

3. **Adicionar veículo:**
```bash
curl -X POST http://localhost:3333/api/vehicles-multi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN_AQUI" \
  -d '{
    "title": "Honda Civic 2020",
    "price": 85000.00,
    "image1": "https://exemplo.com/imagem1.jpg",
    "image2": "https://exemplo.com/imagem2.jpg",
    "image3": "https://exemplo.com/imagem3.jpg",
    "image4": "https://exemplo.com/imagem4.jpg",
    "image5": "https://exemplo.com/imagem5.jpg",
    "image6": "https://exemplo.com/imagem6.jpg",
    "image7": "https://exemplo.com/imagem7.jpg",
    "image8": "https://exemplo.com/imagem8.jpg",
    "mileage": 25000,
    "transmission": "Automático",
    "fuel": "Flex",
    "category": "car",
    "brand": "Honda",
    "model": "Civic",
    "year": 2020,
    "location": "São Paulo, SP",
    "color": "Prata",
    "doors": 4,
    "description": "Veículo em excelente estado."
  }'
```

4. **Listar veículos:**
```bash
curl -X GET "http://localhost:3333/api/vehicles-multi?page=1&limit=10" \
  -H "Authorization: Bearer SEU_JWT_TOKEN_AQUI"
```

5. **Ver estatísticas no dashboard:**
```bash
curl -X GET http://localhost:3333/api/dashboard/stats \
  -H "Authorization: Bearer SEU_JWT_TOKEN_AQUI"
```

### Exemplo 2: Atualizar Plano de Assinatura

1. **Ver planos disponíveis:**
```bash
curl -X GET http://localhost:3333/api/subscriptions/plans
```

2. **Atualizar para plano básico:**
```bash
curl -X PUT http://localhost:3333/api/subscriptions/current \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN_AQUI" \
  -d '{
    "planId": "basic"
  }'
```

### Exemplo 3: Busca Avançada de Veículos

```bash
curl -X GET "http://localhost:3333/api/vehicles-multi?category=car&brand=Honda&minPrice=50000&maxPrice=100000&year=2020&location=São Paulo&search=Civic" \
  -H "Authorization: Bearer SEU_JWT_TOKEN_AQUI"
```

---

## 🔧 Códigos de Status HTTP

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Dados inválidos
- **401** - Não autenticado
- **403** - Sem permissão
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

---

## 📝 Notas Importantes

1. **Autenticação:** Todas as rotas (exceto login, registro e health check) requerem o header `Authorization: Bearer JWT_TOKEN`

2. **Multi-tenancy:** Cada empresa tem seu próprio banco de dados isolado

3. **Limites de Assinatura:** O sistema respeita os limites do plano de assinatura (ex: máximo de veículos)

4. **Validação:** Todos os dados são validados usando Zod schemas

5. **Logs:** Todas as operações são logadas para auditoria

6. **Rate Limiting:** Máximo de 100 requisições por 15 minutos por IP

---

## 🚀 Como Testar

1. **Inicie o servidor:**
```bash
cd back
npm run dev
```

2. **Teste o health check:**
```bash
curl http://localhost:3333/api/health
```

3. **Use Postman ou Insomnia** para testar as rotas com autenticação

4. **Monitore os logs** no diretório `logs/` para debug

---

Este guia cobre todas as funcionalidades implementadas na API do PitStop. Para dúvidas específicas ou implementação de novas funcionalidades, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.
