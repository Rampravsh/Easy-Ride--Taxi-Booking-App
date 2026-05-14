import Rider from '../rider/rider.model';
import { VerificationStatus } from '../rider/rider.interface';
import { redis } from '../../config/redis';
import logger from '../../shared/utils/logger';


export class MatchingEngine {
  /**
   * Find nearest available riders using Redis GEO and MongoDB
   */
  static async findNearbyRiders(params: {
    longitude: number;
    latitude: number;
    radius: number; // in km
    vehicleType: string;
    limit?: number;
  }) {
    const { longitude, latitude, radius, vehicleType, limit = 10 } = params;

    try {
      // 1. We can use MongoDB's $nearSphere for geospatial search
      const query: any = {
        currentLocation: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius * 1000, // convert to meters
          },
        },
        role: 'rider',
        isOnline: true,
        isAvailable: true,
        verificationStatus: VerificationStatus.APPROVED,
      };


      const riders = await Rider.find(query)
        .limit(limit)
        .select('_id fullName phone currentLocation averageRating');


      return riders;
    } catch (error) {
      logger.error('Error finding nearby riders:', error);
      throw error;
    }
  }

  /**
   * Optimization logic: Select best rider based on rating and distance
   */
  static selectBestRider(riders: any[], userLocation: [number, number]) {
    if (riders.length === 0) return null;
    
    // Simple logic: sort by rating then proximity
    // In production, use a more complex score: Score = (Rating * w1) + (DistanceScore * w2)
    return riders.sort((a, b) => b.averageRating - a.averageRating)[0];
  }
}
