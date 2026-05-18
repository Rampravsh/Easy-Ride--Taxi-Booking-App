import { GeoCoordinates } from '../types/user';

export const LocationService = {
  /**
   * Mock Geocoding: Translates a human-readable address to geocoordinates [longitude, latitude].
   * Mimics network latency and matches mock locations dynamically.
   */
  async geocodeAddress(address: string): Promise<{ address: string; coordinates: GeoCoordinates }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lowercaseAddr = address.toLowerCase();
    let coordinates: GeoCoordinates = [-122.4324, 37.7882]; // Default: San Francisco center

    if (lowercaseAddr.includes('office') || lowercaseAddr.includes('washington')) {
      coordinates = [-122.4064, 37.7858]; // SF Financial District
    } else if (lowercaseAddr.includes('coffee') || lowercaseAddr.includes('thornridge')) {
      coordinates = [-122.4183, 37.7901]; // SF Nob Hill
    } else if (lowercaseAddr.includes('burger') || lowercaseAddr.includes('westheimer')) {
      coordinates = [-122.4392, 37.7749]; // SF Castro
    } else if (lowercaseAddr.includes('shopping') || lowercaseAddr.includes('parker')) {
      coordinates = [-122.4014, 37.7942]; // SF Chinatown
    } else if (lowercaseAddr.includes('current location') || lowercaseAddr.includes('current')) {
      coordinates = [-122.4324, 37.7882]; // SF Pacific Heights
    } else {
      // Dynamically offset around SF center so user input still changes the location coordinate
      const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const latOffset = ((hash % 100) / 1000) - 0.05;
      const lngOffset = (((hash >> 2) % 100) / 1000) - 0.05;
      coordinates = [-122.4324 + lngOffset, 37.7882 + latOffset];
    }

    return {
      address,
      coordinates,
    };
  },

  /**
   * Mock Reverse Geocoding: Translates coordinates back into an address.
   */
  async reverseGeocode(coordinates: GeoCoordinates): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return `Location near SF [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`;
  },

  /**
   * Formats a full address string into a distinct title (landmark) and subtitle.
   */
  formatAddress(address: string): { title: string; subtitle: string } {
    if (!address) {
      return { title: 'Selected Location', subtitle: '' };
    }
    
    // Check for dot-separated address
    const dotParts = address.split('.');
    if (dotParts.length > 1 && dotParts[0].length < 30) {
      return {
        title: dotParts[0].trim(),
        subtitle: dotParts.slice(1).join('.').trim(),
      };
    }

    // Check for comma-separated address
    const commaParts = address.split(',');
    if (commaParts.length > 1) {
      return {
        title: commaParts[0].trim(),
        subtitle: commaParts.slice(1).join(',').trim(),
      };
    }

    return {
      title: address,
      subtitle: '',
    };
  },

  /**
   * Calculates direct distance between two coordinates [longitude, latitude] using the Haversine formula.
   * Returns distance in meters.
   */
  calculateDistance(coord1: GeoCoordinates, coord2: GeoCoordinates): number {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },
};
