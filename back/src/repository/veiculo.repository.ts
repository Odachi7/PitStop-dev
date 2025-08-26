import pool from "../database";
import { Veiculo } from "../schemas/veiculoSchema";

export class VeiculoRepository {
  // Adicionar veiculo
  static async add(veiculo: Veiculo) {
    const query = `
      INSERT INTO veiculos 
        (title, price, image, images, mileage, transmission, fuel, category, brand, model, year, location, color, doors, engine, vin, description)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *;
    `;

    const values = [
      veiculo.title,
      veiculo.price,
      veiculo.image,
      veiculo.images ?? [],
      veiculo.mileage,
      veiculo.transmission,
      veiculo.fuel,
      veiculo.category,
      veiculo.brand,
      veiculo.model,
      veiculo.year,
      veiculo.location,
      veiculo.color,
      veiculo.doors,
      veiculo.engine,
      veiculo.vin,
      veiculo.description,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Buscar todos veiculos
  static async getAll() {
    const query = 'SELECT * FROM veiculos ORDER BY id ASC'

    const result = await pool.query(query)

    return result.rows
  }

  // Buscar veiculo pelo ID
  static async getWhitId(id: Number) {
    const query = `SELECT * FROM veiculos WHERE id = ${id}`

    const result = await pool.query(query)

    return result.rows;
  }

  // Alterar veiculo
   static async alterVeiculo(altercategory: string, id: number, newValue: string | number) {
    const allowedColumns = ["title", "price", "image", "images", "mileage", "transmission", "fuel", "category", "brand", "model", "year", "location", "color", "doors", "engine", "vin", "description"];
    if (!allowedColumns.includes(altercategory)) {
      throw new Error("Coluna inválida!");
    }

    const query = `UPDATE veiculos SET ${altercategory} = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(query, [newValue, id]);

    return result.rows[0] || null; 
  }
}
