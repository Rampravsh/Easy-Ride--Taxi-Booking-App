import { VehicleRepository } from './vehicle.repository';
import { ApiError } from '../../shared/errors/ApiError';
import { 
  CreateVehicleDTO, 
  UpdateVehicleDTO, 
  VehicleResponse 
} from './vehicle.types';
import { IVehicle } from './vehicle.interface';
import { VerificationStatus } from '../rider/rider.interface';

export class VehicleService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  /**
   * Format vehicle for response
   */
  private formatVehicleResponse(vehicle: IVehicle): VehicleResponse {
    return {
      id: vehicle._id.toString(),
      rider: vehicle.rider.toString(),
      type: vehicle.type,
      category: vehicle.category,
      brand: vehicle.brand,
      modelName: vehicle.modelName,
      color: vehicle.color,
      year: vehicle.year,
      numberPlate: vehicle.numberPlate,
      seatingCapacity: vehicle.seatingCapacity,
      fuelType: vehicle.fuelType,
      vehicleImage: vehicle.vehicleImage,
      isVerified: vehicle.isVerified,
      isActive: vehicle.isActive,
      verificationStatus: vehicle.verificationStatus,
      documents: vehicle.documents,
    };
  }

  /**
   * Register a new vehicle
   */
  async registerVehicle(riderId: string, vehicleData: CreateVehicleDTO): Promise<VehicleResponse> {
    const vehicle = await this.vehicleRepository.create(riderId, vehicleData);
    return this.formatVehicleResponse(vehicle);
  }

  /**
   * Get all vehicles for a rider
   */
  async getMyVehicles(riderId: string): Promise<VehicleResponse[]> {
    const vehicles = await this.vehicleRepository.findByRiderId(riderId);
    return vehicles.map(v => this.formatVehicleResponse(v));
  }

  /**
   * Get vehicle details
   */
  async getVehicleDetails(vehicleId: string): Promise<VehicleResponse> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }
    return this.formatVehicleResponse(vehicle);
  }

  /**
   * Update vehicle
   */
  async updateVehicle(riderId: string, vehicleId: string, updateData: UpdateVehicleDTO): Promise<VehicleResponse> {
    const isOwner = await this.vehicleRepository.existsForRider(vehicleId, riderId);
    if (!isOwner) {
      throw new ApiError('Unauthorized: You do not own this vehicle', 403);
    }

    const vehicle = await this.vehicleRepository.update(vehicleId, updateData);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }
    return this.formatVehicleResponse(vehicle);
  }

  /**
   * Toggle vehicle activation
   */
  async toggleActivation(riderId: string, vehicleId: string, isActive: boolean): Promise<VehicleResponse> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }

    if (vehicle.rider.toString() !== riderId) {
      throw new ApiError('Unauthorized', 403);
    }

    if (isActive && !vehicle.isVerified) {
      throw new ApiError('Cannot activate an unverified vehicle', 400);
    }

    const updatedVehicle = await this.vehicleRepository.toggleActive(vehicleId, isActive);
    
    if (isActive) {
      // Ensure only one vehicle is active at a time
      await this.vehicleRepository.deactivateOtherVehicles(riderId, vehicleId);
    }

    return this.formatVehicleResponse(updatedVehicle!);
  }

  /**
   * Verify vehicle (Admin only)
   */
  async verifyVehicle(vehicleId: string, status: VerificationStatus): Promise<VehicleResponse> {
    const vehicle = await this.vehicleRepository.updateVerification(vehicleId, status);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }
    return this.formatVehicleResponse(vehicle);
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(riderId: string, vehicleId: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404);
    }

    if (vehicle.rider.toString() !== riderId) {
      throw new ApiError('Unauthorized', 403);
    }

    await this.vehicleRepository.delete(vehicleId);
  }
}
