export interface User {
  id: string;
  name: string;
  avatar?: any; // Using any for require() images or string for URIs
  phone?: string;
  email?: string;
  rating?: number;
  totalReviews?: number;
}

export interface Driver extends User {
  status: 'available' | 'busy' | 'offline';
  location?: {
    latitude: number;
    longitude: number;
  };
}
