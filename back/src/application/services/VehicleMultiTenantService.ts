import { VehicleMultiTenant } from '../../core/entities/VehicleMultiTenant';
import { IVehicleMultiTenantRepository, VehicleSearchFilters } from '../../core/repositories/IVehicleMultiTenantRepository';
import { SubscriptionService } from './SubscriptionService';

export interface CreateVehicleData {
  userId: string;
  title: string;
  price: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  image7?: string;
  image8?: string;
  mileage: number;
  transmission: string;
  fuel: string;
  category: 'car' | 'motorcycle';
  brand: string;
  model: string;
  year: number;
  location: string;
  color: string;
  doors: number;
  engine: string;
  vin: string;
  description: string;
  featured?: boolean;
}

export interface UpdateVehicleData {
  title?: string;
  price?: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  image7?: string;
  image8?: string;
  mileage?: number;
  transmission?: string;
  fuel?: string;
  category?: 'car' | 'motorcycle';
  brand?: string;
  model?: string;
  year?: number;
  location?: string;
  color?: string;
  doors?: number;
  engine?: string;
  vin?: string;
  description?: string;
  status?: 'active' | 'sold' | 'inactive';
  featured?: boolean;
}

export class VehicleMultiTenantService {
  constructor(
    private vehicleRepository: IVehicleMultiTenantRepository,
    private subscriptionService: SubscriptionService
  ) {}

  async createVehicle(data: CreateVehicleData, companyId: string): Promise<VehicleMultiTenant> {
    // Verificar limites da assinatura
    const limits = await this.subscriptionService.checkSubscriptionLimits(companyId, 'vehicles');
    if (!limits.allowed) {
      throw new Error(`Limite de veículos excedido. Máximo permitido: ${limits.limit}`);
    }

    // Verificar limite de imagens
    const images = [data.image1, data.image2, data.image3, data.image4, data.image5, data.image6, data.image7, data.image8].filter(img => img && img.trim());
    const imageLimits = await this.subscriptionService.checkSubscriptionLimits(companyId, 'images');
    if (images.length > imageLimits.limit && imageLimits.limit !== -1) {
      throw new Error(`Limite de imagens excedido. Máximo permitido: ${imageLimits.limit}`);
    }

    const vehicle = VehicleMultiTenant.create({
      userId: data.userId,
      title: data.title,
      price: data.price,
      image1: data.image1,
      image2: data.image2,
      image3: data.image3,
      image4: data.image4,
      image5: data.image5,
      image6: data.image6,
      image7: data.image7,
      image8: data.image8,
      mileage: data.mileage,
      transmission: data.transmission,
      fuel: data.fuel,
      category: data.category,
      brand: data.brand,
      model: data.model,
      year: data.year,
      location: data.location,
      color: data.color,
      doors: data.doors,
      engine: data.engine,
      vin: data.vin,
      description: data.description,
      status: 'active',
      featured: data.featured || false,
      viewsCount: 0
    });

    return await this.vehicleRepository.create(vehicle);
  }

  async updateVehicle(vehicleId: string, data: UpdateVehicleData, userId: string, userRole?: string): Promise<VehicleMultiTenant> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    // Super admin pode editar qualquer veículo
    if (userRole !== 'super_admin' && vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para editar este veículo');
    }

    // Atualizar campos se fornecidos
    if (data.title !== undefined) vehicle.props.title = data.title;
    if (data.price !== undefined) vehicle.updatePrice(data.price);
    if (data.image1 !== undefined) vehicle.props.image1 = data.image1;
    if (data.image2 !== undefined) vehicle.props.image2 = data.image2;
    if (data.image3 !== undefined) vehicle.props.image3 = data.image3;
    if (data.image4 !== undefined) vehicle.props.image4 = data.image4;
    if (data.image5 !== undefined) vehicle.props.image5 = data.image5;
    if (data.image6 !== undefined) vehicle.props.image6 = data.image6;
    if (data.image7 !== undefined) vehicle.props.image7 = data.image7;
    if (data.image8 !== undefined) vehicle.props.image8 = data.image8;
    if (data.mileage !== undefined) vehicle.props.mileage = data.mileage;
    if (data.transmission !== undefined) vehicle.props.transmission = data.transmission;
    if (data.fuel !== undefined) vehicle.props.fuel = data.fuel;
    if (data.category !== undefined) vehicle.props.category = data.category;
    if (data.brand !== undefined) vehicle.props.brand = data.brand;
    if (data.model !== undefined) vehicle.props.model = data.model;
    if (data.year !== undefined) vehicle.props.year = data.year;
    if (data.location !== undefined) vehicle.props.location = data.location;
    if (data.color !== undefined) vehicle.props.color = data.color;
    if (data.doors !== undefined) vehicle.props.doors = data.doors;
    if (data.engine !== undefined) vehicle.props.engine = data.engine;
    if (data.vin !== undefined) vehicle.props.vin = data.vin;
    if (data.description !== undefined) vehicle.props.description = data.description;
    if (data.status !== undefined) vehicle.props.status = data.status;
    if (data.featured !== undefined) vehicle.setFeatured(data.featured);

    vehicle.props.updatedAt = new Date();

    return await this.vehicleRepository.update(vehicle);
  }

  async deleteVehicle(vehicleId: string, userId: string, userRole?: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    // Super admin pode deletar qualquer veículo
    if (userRole === 'super_admin') {
      await this.vehicleRepository.delete(vehicleId);
      return;
    }

    // Outros usuários só podem deletar seus próprios veículos
    if (vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para excluir este veículo');
    }

    await this.vehicleRepository.delete(vehicleId);
  }

  async getVehicleById(vehicleId: string): Promise<VehicleMultiTenant | null> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    
    if (vehicle && vehicle.isActive()) {
      // Incrementar visualizações
      await this.vehicleRepository.incrementViews(vehicleId);
      vehicle.incrementViews();
    }

    return vehicle;
  }

  async getUserVehicles(userId: string): Promise<VehicleMultiTenant[]> {
    return await this.vehicleRepository.findByUserId(userId);
  }

  async searchVehicles(filters: VehicleSearchFilters, limit: number = 20, offset: number = 0): Promise<VehicleMultiTenant[]> {
    // Apenas veículos ativos na busca
    filters.status = 'active';
    
    return await this.vehicleRepository.search(filters, limit, offset);
  }

  async getFeaturedVehicles(limit: number = 10): Promise<VehicleMultiTenant[]> {
    return await this.vehicleRepository.getFeaturedVehicles(limit);
  }

  async getRecentVehicles(limit: number = 10): Promise<VehicleMultiTenant[]> {
    return await this.vehicleRepository.getRecentVehicles(limit);
  }

  async getVehiclesByCategory(category: 'car' | 'motorcycle', limit: number = 20): Promise<VehicleMultiTenant[]> {
    return await this.vehicleRepository.getVehiclesByCategory(category, limit);
  }

  async markAsSold(vehicleId: string, userId: string): Promise<VehicleMultiTenant> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    if (vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para marcar este veículo como vendido');
    }

    vehicle.markAsSold();
    return await this.vehicleRepository.update(vehicle);
  }

  async markAsInactive(vehicleId: string, userId: string): Promise<VehicleMultiTenant> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    if (vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para marcar este veículo como inativo');
    }

    vehicle.markAsInactive();
    return await this.vehicleRepository.update(vehicle);
  }

  async activateVehicle(vehicleId: string, userId: string): Promise<VehicleMultiTenant> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    if (vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para ativar este veículo');
    }

    vehicle.activate();
    return await this.vehicleRepository.update(vehicle);
  }

  async setFeatured(vehicleId: string, featured: boolean, userId: string): Promise<VehicleMultiTenant> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    if (vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para alterar o destaque deste veículo');
    }

    vehicle.setFeatured(featured);
    return await this.vehicleRepository.update(vehicle);
  }

  async addImage(vehicleId: string, imageUrl: string, userId: string): Promise<VehicleMultiTenant> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    if (vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para adicionar imagens a este veículo');
    }

    vehicle.addImage(imageUrl);
    return await this.vehicleRepository.update(vehicle);
  }

  async removeImage(vehicleId: string, imageUrl: string, userId: string): Promise<VehicleMultiTenant> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Veículo não encontrado');
    }

    if (vehicle.userId !== userId) {
      throw new Error('Você não tem permissão para remover imagens deste veículo');
    }

    vehicle.removeImage(imageUrl);
    return await this.vehicleRepository.update(vehicle);
  }

  async getAllVehicles(filters: {
    page: number;
    limit: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    location?: string;
    search?: string;
  }): Promise<VehicleMultiTenant[]> {
    const offset = (filters.page - 1) * filters.limit;
    return await this.vehicleRepository.list(filters.limit, offset);
  }
}
