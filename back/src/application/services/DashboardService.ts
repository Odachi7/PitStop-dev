import { Pool } from 'pg';

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalViews: number;
  favorites: number;
  monthlyViews: number;
  totalMessages: number;
  recentVehicles: any[];
}

export class DashboardService {
  constructor(private pool: Pool) {}

  async getUserStats(userId: string, companyId: string): Promise<DashboardStats> {
    try {
      // Buscar estatísticas do usuário
      const statsQuery = `
        SELECT 
          COUNT(v.id) as total_vehicles,
          COUNT(CASE WHEN v.status = 'active' THEN 1 END) as active_vehicles,
          COALESCE(SUM(v.views_count), 0) as total_views,
          COALESCE(SUM(v.views_count) FILTER (WHERE v.created_at >= date_trunc('month', CURRENT_DATE)), 0) as monthly_views
        FROM vehicles v
        WHERE v.user_id = $1
      `;

      const favoritesQuery = `
        SELECT COUNT(*) as favorites
        FROM favorites f
        WHERE f.user_id = $1
      `;

      const messagesQuery = `
        SELECT COUNT(*) as total_messages
        FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE c.seller_id = $1 OR c.buyer_id = $1
      `;

      const recentVehiclesQuery = `
        SELECT 
          v.id,
          v.title,
          v.price,
          v.images,
          v.views_count,
          v.status,
          v.created_at
        FROM vehicles v
        WHERE v.user_id = $1
        ORDER BY v.created_at DESC
        LIMIT 5
      `;

      const [statsResult, favoritesResult, messagesResult, recentVehiclesResult] = await Promise.all([
        this.pool.query(statsQuery, [userId]),
        this.pool.query(favoritesQuery, [userId]),
        this.pool.query(messagesQuery, [userId]),
        this.pool.query(recentVehiclesQuery, [userId])
      ]);

      const stats = statsResult.rows[0];
      const favorites = favoritesResult.rows[0];
      const messages = messagesResult.rows[0];
      const recentVehicles = recentVehiclesResult.rows;

      return {
        totalVehicles: parseInt(stats.total_vehicles) || 0,
        activeVehicles: parseInt(stats.active_vehicles) || 0,
        totalViews: parseInt(stats.total_views) || 0,
        favorites: parseInt(favorites.favorites) || 0,
        monthlyViews: parseInt(stats.monthly_views) || 0,
        totalMessages: parseInt(messages.total_messages) || 0,
        recentVehicles: recentVehicles.map(vehicle => ({
          id: vehicle.id,
          title: vehicle.title,
          price: parseFloat(vehicle.price),
          images: vehicle.images,
          viewsCount: vehicle.views_count,
          status: vehicle.status,
          createdAt: vehicle.created_at
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw new Error('Erro ao carregar dados do dashboard');
    }
  }

  async getRecentVehicles(userId: string, companyId: string, limit: number = 10): Promise<any[]> {
    try {
      const query = `
        SELECT 
          v.id,
          v.title,
          v.price,
          v.images,
          v.views_count,
          v.status,
          v.created_at,
          v.updated_at
        FROM vehicles v
        WHERE v.user_id = $1
        ORDER BY v.updated_at DESC
        LIMIT $2
      `;

      const result = await this.pool.query(query, [userId, limit]);
      
      return result.rows.map(vehicle => ({
        id: vehicle.id,
        title: vehicle.title,
        price: parseFloat(vehicle.price),
        images: vehicle.images,
        viewsCount: vehicle.views_count,
        status: vehicle.status,
        createdAt: vehicle.created_at,
        updatedAt: vehicle.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar veículos recentes:', error);
      throw new Error('Erro ao carregar veículos recentes');
    }
  }

  async getVehicleAnalytics(userId: string, vehicleId: string): Promise<any> {
    try {
      const query = `
        SELECT 
          v.id,
          v.title,
          v.views_count,
          v.created_at,
          v.updated_at,
          COUNT(f.id) as favorites_count,
          COUNT(c.id) as conversations_count
        FROM vehicles v
        LEFT JOIN favorites f ON f.vehicle_id = v.id
        LEFT JOIN conversations c ON c.vehicle_id = v.id
        WHERE v.id = $1 AND v.user_id = $2
        GROUP BY v.id, v.title, v.views_count, v.created_at, v.updated_at
      `;

      const result = await this.pool.query(query, [vehicleId, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Veículo não encontrado');
      }

      const vehicle = result.rows[0];
      return {
        id: vehicle.id,
        title: vehicle.title,
        viewsCount: vehicle.views_count,
        favoritesCount: parseInt(vehicle.favorites_count) || 0,
        conversationsCount: parseInt(vehicle.conversations_count) || 0,
        createdAt: vehicle.created_at,
        updatedAt: vehicle.updated_at
      };
    } catch (error) {
      console.error('Erro ao buscar analytics do veículo:', error);
      throw new Error('Erro ao carregar analytics do veículo');
    }
  }
}
