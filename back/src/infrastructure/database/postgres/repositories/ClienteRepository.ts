// back/src/infrastructure/database/postgres/repositories/ClientRepository.ts
import { Pool } from 'pg';
import { Client, ClientProps } from '../../../../core/entities/Client';

export class ClientRepository {
  constructor(private pool: Pool) {}

  async encotrarPorEmail(email: string): Promise<Client | null> {
    const query = 'SELECT * FROM clients WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToEntity(result.rows[0]);
  }

  async criar(client: ClientProps): Promise<Client> {
    const query = `
      INSERT INTO clientes (
        id, email, senha_hash, primeiro_nome, ultimo_nome, celular,
        endereco, cidade, estado, codigo_postal, vendedor, ativo,
        nomeEmpresarial, cnpj, cpf, celularEmpresarial, enderecoEmpresarial,
        dt_inc, dt_alt
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *
    `;

    const values = [
      client.id,
      client.email,
      client.senhaHash,
      client.primeiroNome,
      client.ultimoNome,
      client.celular,
      client.endereco,
      client.cidade,
      client.estado,
      client.codigoPostal,
      client.vendedor,
      client.ativo,
      client.nomeEmpresarial,
      client.cnpj,
      client.cpf,
      client.celularEmpresarial,
      client.enderecoEmpresarial,
      client.dt_inc || new Date(),
      client.dt_alt || new Date()
    ];

    const result = await this.pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async atualizar(client: ClientProps): Promise<Client> {
    const query = `
      UPDATE clients SET
        primeiro_nome = $2, ultimo_nome = $3, celular = $4, endereco = $5,
        cidade = $6, estado = $7, codigo_postal = $8, vendedor = $9,
        nomeEmpresarial = $10, cnpj = $11, cpf = $12, celularEmpresarial = $13,
        enderecoEmpresarial = $14, dt_alt = $15, ultimo_login = $16
      WHERE id = $1
      RETURNING *
    `;

    const values = [
      client.id,
      client.primeiroNome,
      client.ultimoNome,
      client.celular,
      client.endereco,
      client.cidade,
      client.estado,
      client.codigoPostal,
      client.vendedor,
      client.nomeEmpresarial,
      client.cnpj,
      client.cpf,
      client.celularEmpresarial,
      client.enderecoEmpresarial,
      client.dt_alt || new Date(),
      client.ultimoLogin
    ];

    const result = await this.pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  private mapToEntity(row: any): Client {
    return Client.create({
      email: row.email,
      senhaHash: row.senha_hash,
      primeiroNome: row.primeiro_nome,
      ultimoNome: row.ultimo_nome,
      celular: row.celular,
      endereco: row.endereco,
      cidade: row.cidade,
      estado: row.estado,
      codigoPostal: row.codigo_postal,
      vendedor: row.vendedor,
      ativo: row.ativo,
      nomeEmpresarial: row.nomeEmpresarial,
      cnpj: row.cnpj,
      cpf: row.cpf,
      celularEmpresarial: row.celularEmpresarial,
      enderecoEmpresarial: row.enderecoEmpresarial,
      dt_inc: row.dt_inc,
      dt_alt: row.dt_alt,
      ultimoLogin: row.ultimo_login
    }, row.id);
  }
}