import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMultiTenant';
import { VehicleMultiTenantService, CreateVehicleData, UpdateVehicleData } from '../../application/services/VehicleMultiTenantService';
import { VehicleMultiTenantRepository } from '../../infrastructure/database/postgres/repositories/VehicleMultiTenantRepository';
import { SubscriptionService } from '../../application/services/SubscriptionService';
import { SubscriptionRepository } from '../../infrastructure/database/postgres/repositories/SubscriptionRepository';
import { CompanyRepository } from '../../infrastructure/database/postgres/repositories/CompanyRepository';
import { mainPool } from '../../shared/config/database.config';

export class VehicleMultiTenantController {
  private static vehicleService = new VehicleMultiTenantService(
    new VehicleMultiTenantRepository(mainPool),
    new SubscriptionService(
      new SubscriptionRepository(mainPool),
      new CompanyRepository(mainPool)
    )
  );

  static async createVehicle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const {
        title, price, image1, image2, image3, image4, image5, image6, image7, image8,
        mileage, transmission, fuel, category, brand, model, year, location, color, doors, engine, vin,
        description, featured
      } = req.body;

      if (!title || !price || !brand || !model || !year || !category) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios: título, preço, marca, modelo, ano e categoria'
        });
      }

      const vehicleData: CreateVehicleData = {
        userId: req.user.userId,
        title,
        price: parseFloat(price),
        image1: image1 || '',
        image2: image2 || '',
        image3: image3 || '',
        image4: image4 || '',
        image5: image5 || '',
        image6: image6 || '',
        image7: image7 || '',
        image8: image8 || '',
        mileage: parseInt(mileage) || 0,
        transmission: transmission || '',
        fuel: fuel || '',
        category,
        brand,
        model,
        year: parseInt(year),
        location: location || '',
        color: color || '',
        doors: parseInt(doors) || 4,
        engine: engine || '',
        vin: vin || '',
        description: description || '',
        featured: featured || false
      };

      const vehicle = await VehicleMultiTenantController.vehicleService.createVehicle(
        vehicleData,
        req.user.companyId
      );

      res.status(201).json({
        success: true,
        data: vehicle
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateVehicle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { vehicleId } = req.params;
      const updateData: UpdateVehicleData = req.body;

      if (!vehicleId) {
        return res.status(400).json({
          success: false,
          error: 'ID do veículo é obrigatório'
        });
      }

      const vehicle = await VehicleMultiTenantController.vehicleService.updateVehicle(
        vehicleId,
        updateData,
        req.user.userId,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async deleteVehicle(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { vehicleId } = req.params;

      if (!vehicleId) {
        return res.status(400).json({
          success: false,
          error: 'ID do veículo é obrigatório'
        });
      }

      await VehicleMultiTenantController.vehicleService.deleteVehicle(
        vehicleId,
        req.user.userId,
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: 'Veículo excluído com sucesso'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getVehicleById(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params;

      if (!vehicleId) {
        return res.status(400).json({
          success: false,
          error: 'ID do veículo é obrigatório'
        });
      }

      const vehicle = await VehicleMultiTenantController.vehicleService.getVehicleById(vehicleId);

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Veículo não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getUserVehicles(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const vehicles = await VehicleMultiTenantController.vehicleService.getUserVehicles(
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async searchVehicles(req: Request, res: Response) {
    try {
      const {
        category, brand, model, yearMin, yearMax, priceMin, priceMax,
        location, transmission, fuel, featured, limit, offset
      } = req.query;

      const filters = {
        category: category as 'car' | 'motorcycle',
        brand: brand as string,
        model: model as string,
        yearMin: yearMin ? parseInt(yearMin as string) : undefined,
        yearMax: yearMax ? parseInt(yearMax as string) : undefined,
        priceMin: priceMin ? parseFloat(priceMin as string) : undefined,
        priceMax: priceMax ? parseFloat(priceMax as string) : undefined,
        location: location as string,
        transmission: transmission as string,
        fuel: fuel as string,
        featured: featured ? featured === 'true' : undefined
      };

      const vehicles = await VehicleMultiTenantController.vehicleService.searchVehicles(
        filters,
        limit ? parseInt(limit as string) : 20,
        offset ? parseInt(offset as string) : 0
      );

      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getFeaturedVehicles(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const vehicles = await VehicleMultiTenantController.vehicleService.getFeaturedVehicles(limit);

      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getRecentVehicles(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const vehicles = await VehicleMultiTenantController.vehicleService.getRecentVehicles(limit);

      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getVehiclesByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      if (!['car', 'motorcycle'].includes(category)) {
        return res.status(400).json({
          success: false,
          error: 'Categoria inválida'
        });
      }

      const vehicles = await VehicleMultiTenantController.vehicleService.getVehiclesByCategory(
        category as 'car' | 'motorcycle',
        limit
      );

      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async markAsSold(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { vehicleId } = req.params;

      if (!vehicleId) {
        return res.status(400).json({
          success: false,
          error: 'ID do veículo é obrigatório'
        });
      }

      const vehicle = await VehicleMultiTenantController.vehicleService.markAsSold(
        vehicleId,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async setFeatured(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
      }

      const { vehicleId } = req.params;
      const { featured } = req.body;

      if (!vehicleId) {
        return res.status(400).json({
          success: false,
          error: 'ID do veículo é obrigatório'
        });
      }

      const vehicle = await VehicleMultiTenantController.vehicleService.setFeatured(
        vehicleId,
        featured,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getAllVehicles(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        category, 
        brand, 
        minPrice, 
        maxPrice, 
        year, 
        location, 
        search 
      } = req.query;

      const vehicles = await VehicleMultiTenantController.vehicleService.getAllVehicles({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        category: category as string,
        brand: brand as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        year: year ? parseInt(year as string) : undefined,
        location: location as string,
        search: search as string
      });

      res.json({
        success: true,
        data: {
          vehicles,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total: vehicles.length
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}
