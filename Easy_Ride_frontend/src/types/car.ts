export interface Car {
  id: string;
  name: string;
  type: 'Transport' | 'Delivery' | 'Rental';
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
