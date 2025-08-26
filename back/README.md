# PitStop Backend

Backend para o sistema PitStop desenvolvido com Node.js, TypeScript e Express.

## 🚀 Como executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL rodando na porta 5434
- Banco de dados `pitstop` criado

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🔧 Configuração do Banco de Dados

Edite o arquivo `src/database.ts` com suas credenciais:

```typescript
const pool = new Pool({
  user: "seu_usuario",
  host: "localhost",
  database: "pitstop",
  password: "sua_senha",
  port: 5434, 
});
```

## 📡 Endpoints

### GET /teste
Teste básico da API
```bash
curl http://localhost:3333/teste
```

### POST /additem
Adiciona um veículo ao banco de dados
```bash
curl -X POST http://localhost:3333/additem \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Carro Teste",
    "price": 50000,
    "model": "Sedan",
    "year": 2023
  }'
```

## 🛠️ Correções Realizadas

1. **Dependências faltantes**: Adicionadas `cors`, `express-async-errors`, `pg` e seus tipos
2. **Conflito de versões**: Ajustado Express para versão 4.18.2 para compatibilidade
3. **Importações**: Corrigidas as importações com extensão `.js` para ES modules
4. **TypeScript**: Simplificada a configuração do `tsconfig.json`
5. **Scripts**: Atualizados para usar `tsx` em vez de `ts-node`

## 📁 Estrutura do Projeto

```
src/
├── server.ts      # Servidor principal
├── database.ts    # Configuração do PostgreSQL
└── routes.ts      # Rotas da API
```

## 🗄️ Banco de Dados

Certifique-se de que a tabela `veiculo` existe no banco:

```sql
CREATE TABLE veiculo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    model VARCHAR(100),
    year INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```
