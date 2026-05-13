import Vehicle from './vehicle.model';
import { IVehicle } from './vehicle.interface';
import { CreateVehicleDTO, UpdateVehicleDTO } from './vehicle.types';
import { VerificationStatus } from '../rider/rider.interface';

export class VehicleRepository {
  /**
   * Create a new vehicle
   */
  async create(riderId: string, vehicleData: CreateVehicleDTO): Promise<IVehicle> {
    return await Vehicle.create({
      ...vehicleData,
      rider: riderId,
    });
  }

  /**
   * Find vehicle by ID
   */
  async findById(id: string): Promise<IVehicle | null> {
    return await Vehicle.findById(id);
  }

  /**
   * Find vehicles by Rider ID
   */
  async findByRiderId(riderId: string): Promise<IVehicle[]> {
    return await Vehicle.find({ rider: riderId });
  }

  /**
   * Update vehicle
   */
  async update(id: string, updateData: UpdateVehicleDTO): Promise<IVehicle | null> {
    return await Vehicle.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update verification status
   */
  async updateVerification(id: string, status: VerificationStatus): Promise<IVehicle | null> {
    return await Vehicle.findByIdAndUpdate(
      id,
      { 
        $set: { 
          verificationStatus: status,
          isVerified: status === VerificationStatus.APPROVED 
        } 
      },
      { new: true }
    );
  }

  /**
   * Toggle active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<IVehicle | null> {
    return await Vehicle.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    );
  }

  /**
   * Deactivate all other vehicles for this rider (maintain one active vehicle)
   */
  async deactivateOtherVehicles(riderId: string, activeVehicleId: string): Promise<void> {
    await Vehicle.updateMany(
      { rider: riderId, _id: { $ne: activeVehicleId } },
      { $set: { isActive: false } }
    );
  }

  /**
   * Delete vehicle
   */
  async delete(id: string): Promise<IVehicle | null> {
    return await Vehicle.findByIdAndDelete(id);
  }

  /**
   * Check if vehicle exists for rider
   */
  async existsForRider(vehicleId: string, riderId: string): Promise<boolean> {
    const vehicle = await Vehicle.findOne({ _id: vehicleId, rider: riderId });
    return !!vehicle;
  }
}
