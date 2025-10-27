import { Router } from 'express';
import { VehicleMultiTenantController } from '../controllers/VehicleMultiTenantController';
import { authenticateToken } from '../middleware/authMultiTenant';

const router = Router();

// Rotas públicas
router.get('/', VehicleMultiTenantController.getAllVehicles);
router.get('/search', VehicleMultiTenantController.searchVehicles);
router.get('/featured', VehicleMultiTenantController.getFeaturedVehicles);
router.get('/recent', VehicleMultiTenantController.getRecentVehicles);
router.get('/category/:category', VehicleMultiTenantController.getVehiclesByCategory);
router.get('/:vehicleId', VehicleMultiTenantController.getVehicleById);

// Rotas protegidas
router.use(authenticateToken);

// CRUD de veículos
router.post('/', VehicleMultiTenantController.createVehicle);
router.put('/:vehicleId', VehicleMultiTenantController.updateVehicle);
router.delete('/:vehicleId', VehicleMultiTenantController.deleteVehicle);

// Ações específicas
router.get('/user/vehicles', VehicleMultiTenantController.getUserVehicles);
router.post('/:vehicleId/sold', VehicleMultiTenantController.markAsSold);
router.post('/:vehicleId/featured', VehicleMultiTenantController.setFeatured);

export { router as vehicleMultiTenantRoutes };
