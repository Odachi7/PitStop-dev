# 🚀 Guia de Integração Frontend-Backend

Este guia explica como testar a integração entre o frontend React e o backend Node.js do PitStop.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL rodando
- Backend configurado e rodando

## 🚀 Como Testar

### 1. Iniciar o Backend

```bash
cd back
npm install
npm run dev
```

O backend estará rodando em `http://localhost:3333`

### 2. Iniciar o Frontend

```bash
cd Front
npm install
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 3. Testar a Integração

#### Passo 1: Acessar o Catálogo (sem login)
- Acesse `http://localhost:5173/catalogo`
- Você deve ver uma mensagem de erro: "Acesso negado - faça login para ver os veículos"

#### Passo 2: Criar uma Conta
- Acesse `http://localhost:5173/register`
- Preencha o formulário com:
  - Nome: João
  - Sobrenome: Silva
  - Empresa: Minha Empresa LTDA
  - Email: joao@empresa.com
  - Senha: senha123
- Clique em "Criar conta"

#### Passo 3: Fazer Login
- Acesse `http://localhost:5173/login`
- Use as credenciais criadas no passo anterior
- Clique em "Entrar"

#### Passo 4: Verificar o Catálogo
- Após o login, você será redirecionado para o catálogo
- Se não houver veículos cadastrados, você verá "Nenhum veículo encontrado"
- Se houver veículos, eles serão exibidos com paginação

## 🔧 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email e senha
- [x] Registro de nova empresa/usuário
- [x] Logout
- [x] Persistência de token no localStorage
- [x] Verificação automática de autenticação

### ✅ Integração com API
- [x] Serviço centralizado de API (`lib/api.ts`)
- [x] Tratamento de erros de conexão
- [x] Headers de autenticação automáticos
- [x] Conversão de dados da API para o formato do frontend

### ✅ Gestão de Veículos
- [x] Listagem de veículos com paginação
- [x] Filtros por categoria, marca, preço
- [x] Busca por texto
- [x] Carregamento automático após login
- [x] Estados de loading e erro

### ✅ Interface do Usuário
- [x] Componentes de login e registro funcionais
- [x] Header com estado de autenticação
- [x] Botão de logout
- [x] Redirecionamento automático
- [x] Tratamento de erros amigável

## 🐛 Solução de Problemas

### Erro: "Acesso negado - faça login para ver os veículos"
- **Causa**: API requer autenticação
- **Solução**: Faça login primeiro

### Erro: "Erro de conexão - verifique se o servidor está rodando"
- **Causa**: Backend não está rodando
- **Solução**: Inicie o backend com `npm run dev` na pasta `back`

### Erro: "Nenhum veículo encontrado"
- **Causa**: Não há veículos cadastrados no banco
- **Solução**: Cadastre veículos via API ou interface administrativa

### Erro de CORS
- **Causa**: Configuração de CORS no backend
- **Solução**: Verifique se o backend está configurado para aceitar requisições do frontend

## 📊 Estrutura de Dados

### Veículo da API → Frontend
```typescript
// API retorna
{
  id: "uuid",
  title: "Honda Civic 2020",
  price: 85000.00,
  category: "car", // ou "motorcycle"
  image1: "url1",
  image2: "url2",
  // ...
}

// Frontend converte para
{
  id: 123, // convertido para number
  title: "Honda Civic 2020",
  price: 85000.00,
  category: "Carro", // convertido para português
  image: "url1", // primeira imagem como principal
  images: ["url1", "url2", ...], // array de imagens
  // ...
}
```

## 🔄 Fluxo de Autenticação

1. **Usuário acessa catálogo** → API retorna erro de autenticação
2. **Usuário faz login** → Token é salvo no localStorage
3. **Token é enviado automaticamente** → API retorna veículos
4. **Veículos são exibidos** → Interface atualizada

## 🎯 Próximos Passos

- [ ] Implementar refresh automático de token
- [ ] Adicionar cache de veículos
- [ ] Implementar busca avançada
- [ ] Adicionar favoritos
- [ ] Implementar upload de imagens
- [ ] Adicionar testes automatizados

## 📝 Notas Técnicas

- O frontend usa React 19 com TypeScript
- Estado gerenciado via Context API
- Requisições HTTP com fetch nativo
- Styling com Tailwind CSS
- Roteamento com React Router v7

