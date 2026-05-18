import { RideType, VehicleCategory } from './ride';

export interface Car {
  id: string;
  name: string;
  type: RideType | 'Transport' | 'Delivery' | 'Rental';
  category: VehicleCategory;
  image: any;
  rating: number;
  reviews: number;
  pricePerHour: number;
  specifications?: {
    maxPower: string;
    fuelType: string;
    maxSpeed: string;
    doors: number;
    passengers: number;
  };
}
