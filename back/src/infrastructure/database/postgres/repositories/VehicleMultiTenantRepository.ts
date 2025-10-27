import { Pool } from 'pg';
import { VehicleMultiTenant, VehicleMultiTenantProps } from '../../../../core/entities/VehicleMultiTenant';
import { IVehicleMultiTenantRepository, VehicleSearchFilters } from '../../../../core/repositories/IVehicleMultiTenantRepository';

export class VehicleMultiTenantRepository implements IVehicleMultiTenantRepository {
  constructor(private pool: Pool) {}

  async findById(id: number): Promise<VehicleMultiTenant | null> {
    const query = `
      SELECT * FROM vehicles 
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return VehicleMultiTenant.create({
      userId: row.user_id,
      title: row.title,
      price: parseFloat(row.price),
      image1: row.image1,
      image2: row.image2,
      image3: row.image3,
      image4: row.image4,
      image5: row.image5,
      image6: row.image6,
      image7: row.image7,
      image8: row.image8,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel: row.fuel,
      category: row.category,
      brand: row.brand,
      model: row.model,
      year: row.year,
      location: row.location,
      color: row.color,
      doors: row.doors,
      engine: row.engine,
      vin: row.vin,
      description: row.description,
      status: row.status,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id);
  }

  async findByUserId(userId: string): Promise<VehicleMultiTenant[]> {
    const query = `
      SELECT * FROM vehicles 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await this.pool.query(query, [userId]);
    
    return result.rows.map(row => VehicleMultiTenant.create({
      userId: row.user_id,
      title: row.title,
      price: parseFloat(row.price),
      image1: row.image1,
      image2: row.image2,
      image3: row.image3,
      image4: row.image4,
      image5: row.image5,
      image6: row.image6,
      image7: row.image7,
      image8: row.image8,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel: row.fuel,
      category: row.category,
      brand: row.brand,
      model: row.model,
      year: row.year,
      location: row.location,
      color: row.color,
      doors: row.doors,
      engine: row.engine,
      vin: row.vin,
      description: row.description,
      status: row.status,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async search(filters: VehicleSearchFilters, limit: number = 20, offset: number = 0): Promise<VehicleMultiTenant[]> {
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (filters.category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(filters.category);
    }

    if (filters.brand) {
      paramCount++;
      query += ` AND brand ILIKE $${paramCount}`;
      params.push(`%${filters.brand}%`);
    }

    if (filters.model) {
      paramCount++;
      query += ` AND model ILIKE $${paramCount}`;
      params.push(`%${filters.model}%`);
    }

    if (filters.yearMin) {
      paramCount++;
      query += ` AND year >= $${paramCount}`;
      params.push(filters.yearMin);
    }

    if (filters.yearMax) {
      paramCount++;
      query += ` AND year <= $${paramCount}`;
      params.push(filters.yearMax);
    }

    if (filters.priceMin) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(filters.priceMin);
    }

    if (filters.priceMax) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(filters.priceMax);
    }

    if (filters.location) {
      paramCount++;
      query += ` AND location ILIKE $${paramCount}`;
      params.push(`%${filters.location}%`);
    }

    if (filters.transmission) {
      paramCount++;
      query += ` AND transmission = $${paramCount}`;
      params.push(filters.transmission);
    }

    if (filters.fuel) {
      paramCount++;
      query += ` AND fuel = $${paramCount}`;
      params.push(filters.fuel);
    }

    if (filters.status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters.featured !== undefined) {
      paramCount++;
      query += ` AND featured = $${paramCount}`;
      params.push(filters.featured);
    }

    query += ' ORDER BY created_at DESC';
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await this.pool.query(query, params);
    
    return result.rows.map(row => VehicleMultiTenant.create({
      userId: row.user_id,
      title: row.title,
      price: parseFloat(row.price),
      image1: row.image1,
      image2: row.image2,
      image3: row.image3,
      image4: row.image4,
      image5: row.image5,
      image6: row.image6,
      image7: row.image7,
      image8: row.image8,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel: row.fuel,
      category: row.category,
      brand: row.brand,
      model: row.model,
      year: row.year,
      location: row.location,
      color: row.color,
      doors: row.doors,
      engine: row.engine,
      vin: row.vin,
      description: row.description,
      status: row.status,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async create(vehicle: VehicleMultiTenant): Promise<VehicleMultiTenant> {
    const query = `
      INSERT INTO vehicles (
        id, user_id, title, price, image1, image2, image3, image4, image5, image6, image7, image8,
        mileage, transmission, fuel, category, brand, model, year, location, color, doors, engine,
        vin, description, status, featured, views_count, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
      RETURNING *
    `;
    
    const values = [
      vehicle.id,
      vehicle.userId,
      vehicle.title,
      vehicle.price,
      vehicle.image1,
      vehicle.image2,
      vehicle.image3,
      vehicle.image4,
      vehicle.image5,
      vehicle.image6,
      vehicle.image7,
      vehicle.image8,
      vehicle.mileage,
      vehicle.transmission,
      vehicle.fuel,
      vehicle.category,
      vehicle.brand,
      vehicle.model,
      vehicle.year,
      vehicle.location,
      vehicle.color,
      vehicle.doors,
      vehicle.engine,
      vehicle.vin,
      vehicle.description,
      vehicle.status,
      vehicle.featured,
      vehicle.viewsCount,
      vehicle.createdAt || new Date(),
      vehicle.updatedAt || new Date()
    ];

    const result = await this.pool.query(query, values);
    return vehicle;
  }

  async update(vehicle: VehicleMultiTenant): Promise<VehicleMultiTenant> {
    const query = `
      UPDATE vehicles SET
        user_id = $2,
        title = $3,
        price = $4,
        image1 = $5,
        image2 = $6,
        image3 = $7,
        image4 = $8,
        image5 = $9,
        image6 = $10,
        image7 = $11,
        image8 = $12,
        mileage = $13,
        transmission = $14,
        fuel = $15,
        category = $16,
        brand = $17,
        model = $18,
        year = $19,
        location = $20,
        color = $21,
        doors = $22,
        engine = $23,
        vin = $24,
        description = $25,
        status = $26,
        featured = $27,
        views_count = $28,
        updated_at = $29
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [
      vehicle.id,
      vehicle.userId,
      vehicle.title,
      vehicle.price,
      vehicle.image1,
      vehicle.image2,
      vehicle.image3,
      vehicle.image4,
      vehicle.image5,
      vehicle.image6,
      vehicle.image7,
      vehicle.image8,
      vehicle.mileage,
      vehicle.transmission,
      vehicle.fuel,
      vehicle.category,
      vehicle.brand,
      vehicle.model,
      vehicle.year,
      vehicle.location,
      vehicle.color,
      vehicle.doors,
      vehicle.engine,
      vehicle.vin,
      vehicle.description,
      vehicle.status,
      vehicle.featured,
      vehicle.viewsCount,
      new Date()
    ];

    await this.pool.query(query, values);
    return vehicle;
  }

  async delete(id: number): Promise<void> {
    const query = `DELETE FROM vehicles WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  async list(limit: number = 20, offset: number = 0): Promise<VehicleMultiTenant[]> {
    const query = `
      SELECT * FROM vehicles 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const result = await this.pool.query(query, [limit, offset]);
    
    return result.rows.map(row => VehicleMultiTenant.create({
      userId: row.user_id,
      title: row.title,
      price: parseFloat(row.price),
      image1: row.image1,
      image2: row.image2,
      image3: row.image3,
      image4: row.image4,
      image5: row.image5,
      image6: row.image6,
      image7: row.image7,
      image8: row.image8,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel: row.fuel,
      category: row.category,
      brand: row.brand,
      model: row.model,
      year: row.year,
      location: row.location,
      color: row.color,
      doors: row.doors,
      engine: row.engine,
      vin: row.vin,
      description: row.description,
      status: row.status,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async incrementViews(id: number): Promise<void> {
    const query = `
      UPDATE vehicles 
      SET views_count = views_count + 1, updated_at = NOW()
      WHERE id = $1
    `;
    await this.pool.query(query, [id]);
  }

  async getFeaturedVehicles(limit: number = 10): Promise<VehicleMultiTenant[]> {
    const query = `
      SELECT * FROM vehicles 
      WHERE featured = true AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    
    const result = await this.pool.query(query, [limit]);
    
    return result.rows.map(row => VehicleMultiTenant.create({
      userId: row.user_id,
      title: row.title,
      price: parseFloat(row.price),
      image1: row.image1,
      image2: row.image2,
      image3: row.image3,
      image4: row.image4,
      image5: row.image5,
      image6: row.image6,
      image7: row.image7,
      image8: row.image8,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel: row.fuel,
      category: row.category,
      brand: row.brand,
      model: row.model,
      year: row.year,
      location: row.location,
      color: row.color,
      doors: row.doors,
      engine: row.engine,
      vin: row.vin,
      description: row.description,
      status: row.status,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async getRecentVehicles(limit: number = 10): Promise<VehicleMultiTenant[]> {
    const query = `
      SELECT * FROM vehicles 
      WHERE status = 'active'
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    
    const result = await this.pool.query(query, [limit]);
    
    return result.rows.map(row => VehicleMultiTenant.create({
      userId: row.user_id,
      title: row.title,
      price: parseFloat(row.price),
      image1: row.image1,
      image2: row.image2,
      image3: row.image3,
      image4: row.image4,
      image5: row.image5,
      image6: row.image6,
      image7: row.image7,
      image8: row.image8,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel: row.fuel,
      category: row.category,
      brand: row.brand,
      model: row.model,
      year: row.year,
      location: row.location,
      color: row.color,
      doors: row.doors,
      engine: row.engine,
      vin: row.vin,
      description: row.description,
      status: row.status,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }

  async getVehiclesByCategory(category: 'car' | 'motorcycle', limit: number = 20): Promise<VehicleMultiTenant[]> {
    const query = `
      SELECT * FROM vehicles 
      WHERE category = $1 AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    
    const result = await this.pool.query(query, [category, limit]);
    
    return result.rows.map(row => VehicleMultiTenant.create({
      userId: row.user_id,
      title: row.title,
      price: parseFloat(row.price),
      image1: row.image1,
      image2: row.image2,
      image3: row.image3,
      image4: row.image4,
      image5: row.image5,
      image6: row.image6,
      image7: row.image7,
      image8: row.image8,
      mileage: row.mileage,
      transmission: row.transmission,
      fuel: row.fuel,
      category: row.category,
      brand: row.brand,
      model: row.model,
      year: row.year,
      location: row.location,
      color: row.color,
      doors: row.doors,
      engine: row.engine,
      vin: row.vin,
      description: row.description,
      status: row.status,
      featured: row.featured,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }, row.id));
  }
}
