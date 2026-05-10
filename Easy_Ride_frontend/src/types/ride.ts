import { Car } from './car';
import { Driver } from './user';

export interface ChargeBreakdown {
  baseFare: number;
  vat: number;
  promoDiscount?: number;
  total: number;
}

export interface Ride {
  id: string;
  car: Car;
  driver?: Driver;
  pickupLocation: string;
  destinationLocation: string;
  distance: string;
  duration: string;
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  charges: ChargeBreakdown;
  paymentMethod: {
    id: string;
    label: string;
    type: 'Visa' | 'Mastercard' | 'Paypal' | 'Cash';
  };
}
