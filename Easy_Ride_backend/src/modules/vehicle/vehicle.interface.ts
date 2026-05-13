import { Document, Types } from 'mongoose';
import { VerificationStatus } from '../rider/rider.interface';

export enum VehicleType {
  BIKE = 'bike',
  AUTO = 'auto',
  CAR = 'car',
  SUV = 'suv',
  PREMIUM = 'premium',
}

export enum VehicleCategory {
  ECONOMY = 'economy',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
  POOL = 'pool',
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  CNG = 'cng',
  HYBRID = 'hybrid',
}

export interface IVehicleDocument {
  url: string;
  status: VerificationStatus;
  uploadedAt: Date;
}

export interface IVehicleDocuments {
  rcBook: IVehicleDocument;
  insurance: IVehicleDocument;
  pollution: IVehicleDocument;
  permit: IVehicleDocument;
  fitnessCertificate: IVehicleDocument;
}

export interface IVehicle extends Document {
  rider: Types.ObjectId;
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
  documents: IVehicleDocuments;
  isVerified: boolean;
  isActive: boolean;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}
