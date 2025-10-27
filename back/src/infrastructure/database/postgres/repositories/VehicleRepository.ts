// back/src/infrastructure/database/postgres/repositories/VehicleRepository.ts
import { Pool } from 'pg';
import { Vehicle, VeiculoProps } from '../../../../core/entities/Vehicle';

export class VehicleRepository {
  constructor(private pool: Pool) {}

  async create(vehicle: VeiculoProps): Promise<Vehicle> {
    const query = `
      INSERT INTO veiculos (
        id, vendedor_id, marca, modelo, categoria, ano, cor, portas, quilometragem, tipoCombustivel,
        transmissao, motor, valor, moeda, status, titulo, descricao,
        imagemPrincipal, imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, imagem8, localizacaoCidade, 
        localizacaoEstado, numeroIdentificacao, dt_inc, dt_alt, dt_public
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27, $28, $29, $30, $31 
      ) RETURNING *
    `;

    const values = [
      vehicle.id,
      vehicle.vendedorId,
      vehicle.marca,
      vehicle.modelo,
      vehicle.categoria,
      vehicle.ano,
      vehicle.cor,
      vehicle.portas,
      vehicle.quilometragem,
      vehicle.tipoCombustivel,
      vehicle.transmissao,
      vehicle.motor,
      vehicle.valor,
      vehicle.moeda,
      vehicle.status,
      vehicle.titulo,
      vehicle.descricao,
      vehicle.imagemPrincipal,
      vehicle.imagem2,
      vehicle.imagem3,
      vehicle.imagem4,
      vehicle.imagem5,
      vehicle.imagem6,
      vehicle.imagem7,
      vehicle.imagem8,
      vehicle.localizacaoCidade,
      vehicle.localizacaoEstado,
      vehicle.numeroIdentificacao,
      vehicle.dt_inc || new Date(),
      vehicle.dt_alt || new Date(),
      vehicle.dt_public
    ];

    const result = await this.pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async findBySellerId(sellerId: string): Promise<Vehicle[]> {
    const query = 'SELECT * FROM veiculos WHERE vendedor_id = $1 ORDER BY dt_inc DESC';
    const result = await this.pool.query(query, [sellerId]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async findAvailable(): Promise<Vehicle[]> {
    const query = `
      SELECT v.*, c.nomeEmpresarial, c.celular as celular_vendedor
      FROM veiculos v
      JOIN clientes c ON v.vendedor_id = c.id
      WHERE v.status = 'disponivel'
      ORDER BY v.dt_inc DESC
    `;
    const result = await this.pool.query(query);
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Vehicle {
    return Vehicle.create({
        id: row.id,
        vendedorId: row.vendedor_id,
        marca: row.marca,
        modelo: row.modelo,
        categoria: row.categoria,
        ano: row.ano,
        cor: row.cor,
        portas: row.portas,
        quilometragem: row.quilometragem,
        tipoCombustivel: row.tipoCombustivel,
        transmissao: row.transmissao,
        motor: row.motor,
        valor: parseFloat(row.valor),
        moeda: row.moeda,
        status: row.status,
        titulo: row.titulo,
        descricao: row.descricao,
        imagemPrincipal: row.imagemPrincipal,
        imagem2: row.imagem2,
        imagem3: row.imagem3,
        imagem4: row.imagem4,
        imagem5: row.imagem5,
        imagem6: row.imagem6,
        imagem7: row.imagem7,
        imagem8: row.imagem8,
        localizacaoCidade: row.localizacaoCidade,
        localizacaoEstado: row.localizacaoEstado,
        numeroIdentificacao: row.numeroIdentificacao,
        dt_inc: row.dt_inc,
        dt_alt: row.dt_alt,
        dt_public: row.dt_public
    }, row.id);
  }
}