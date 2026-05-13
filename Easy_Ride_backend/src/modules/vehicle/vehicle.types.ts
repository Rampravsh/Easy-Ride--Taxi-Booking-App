import { VehicleType, VehicleCategory, FuelType, IVehicleDocuments } from './vehicle.interface';
import { VerificationStatus } from '../rider/rider.interface';

export type CreateVehicleDTO = {
  type: VehicleType;
  category: VehicleCategory;
  brand: string;
  modelName: string;
  color: string;
  year: number;
  numberPlate: string;
  seatingCapacity: number;
  fuelType: FuelType;
  vehicleImage?: string;
};

export type UpdateVehicleDTO = Partial<CreateVehicleDTO>;

export type VehicleResponse = {
  id: string;
  rider: string;
  type: VehicleType;
  category: VehicleCategory;
  brand: string;
  modelName: string;
  color: string;
  year: number;
  numberPlate: string;
  seatingCapacity: number;
  fuelType: FuelType;
  vehicleImage?: string;
  isVerified: boolean;
  isActive: boolean;
  verificationStatus: VerificationStatus;
  documents: IVehicleDocuments;
};

export type UploadVehicleDocumentDTO = {
  type: keyof IVehicleDocuments;
  url: string;
};
