// back/src/application/services/AuthService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ClientRepository } from '../../infrastructure/database/postgres/repositories/ClienteRepository';
import { Client } from '../../core/entities/Client';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '7d';

  constructor(private clientRepository: ClientRepository) {}

  async login(email: string, password: string) {
    // Buscar cliente existente
    let client = await this.clientRepository.encotrarPorEmail(email);
    
    if (!client) {
      // Se não existe, criar automaticamente
      client = await this.criarClienteNoLogin(email, password);
    } else {
      const isValidPassword = await bcrypt.compare(password, client.senhaHash);
      if (!isValidPassword) {
        throw new Error('Credenciais inválidas');
      }
    }

    // Atualizar último login
    client.atualizarUltimoLogin();
    await this.clientRepository.atualizar(client);

    // Gerar JWT
    const token = jwt.sign(
      { 
        clienteID: client.id, 
        email: client.email,
        vendedor: client.vendedor
      },
      AuthService.JWT_SECRET,
      { expiresIn: AuthService.JWT_EXPIRES_IN }
    );

    return {
      token,
      client: {
        id: client.id,
        email: client.email,
        primeiroNome: client.primeiroNome,
        ultimoNome: client.ultimoNome,
        vendedor: client.vendedor,
        nomeEmpresarial: client.nomeEmpresarial
      }
    };
  }

  private async criarClienteNoLogin(email: string, password: string): Promise<Client> {
    const senhaHash = await bcrypt.hash(password, 12);
    
    // Extrair nome do email (parte antes do @)
    const emailNome = email.split('@')[0];
    const primeiroNome = emailNome.split('.')[0] || emailNome;
    const ultimoNome = emailNome.split('.')[1] || '';

    const client = Client.create({
      email,
      senhaHash,
      primeiroNome: primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1),
      ultimoNome: ultimoNome.charAt(0).toUpperCase() + ultimoNome.slice(1),
      vendedor: false,
      ativo: true,
      dt_inc: new Date(),
      dt_alt: new Date()
    });

    return await this.clientRepository.criar(client);
  }

  async registrar(email: string, password: string, primeiroNome: string, ultimoNome: string) {
    // Verificar se já existe
    const existeCliete = await this.clientRepository.encotrarPorEmail(email);
    if (existeCliete) {
      throw new Error('Email já está em uso');
    }

    const senhaHash = await bcrypt.hash(password, 12);
    
    const client = Client.create({
      email,
      senhaHash,
      primeiroNome,
      ultimoNome,
      vendedor: false,
      ativo: true,
      dt_inc: new Date(),
      dt_alt: new Date()
    });

    const createdClient = await this.clientRepository.criar(client);

    // Gerar JWT
    const token = jwt.sign(
      { 
        clientId: createdClient.id, 
        email: createdClient.email,
        isSeller: createdClient.vendedor
      },
      AuthService.JWT_SECRET,
      { expiresIn: AuthService.JWT_EXPIRES_IN }
    );

    return {
      token,
      client: {
        id: createdClient.id,
        email: createdClient.email,
        firstName: createdClient.primeiroNome,
        lastName: createdClient.ultimoNome,
        isSeller: createdClient.vendedor
      }
    };
  }
}