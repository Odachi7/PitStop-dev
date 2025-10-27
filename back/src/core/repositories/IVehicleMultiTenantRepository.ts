import { VehicleMultiTenant } from '../entities/VehicleMultiTenant';

export interface VehicleSearchFilters {
  category?: 'car' | 'motorcycle';
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  transmission?: string;
  fuel?: string;
  status?: 'active' | 'sold' | 'inactive';
  featured?: boolean;
}

export interface IVehicleMultiTenantRepository {
  findById(id: number): Promise<VehicleMultiTenant | null>;
  findByUserId(userId: string): Promise<VehicleMultiTenant[]>;
  search(filters: VehicleSearchFilters, limit?: number, offset?: number): Promise<VehicleMultiTenant[]>;
  create(vehicle: VehicleMultiTenant): Promise<VehicleMultiTenant>;
  update(vehicle: VehicleMultiTenant): Promise<VehicleMultiTenant>;
  delete(id: number): Promise<void>;
  list(limit?: number, offset?: number): Promise<VehicleMultiTenant[]>;
  incrementViews(id: number): Promise<void>;
  getFeaturedVehicles(limit?: number): Promise<VehicleMultiTenant[]>;
  getRecentVehicles(limit?: number): Promise<VehicleMultiTenant[]>;
  getVehiclesByCategory(category: 'car' | 'motorcycle', limit?: number): Promise<VehicleMultiTenant[]>;
}
