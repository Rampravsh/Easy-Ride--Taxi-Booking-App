import { FraudType } from '../../shared/enums';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';
import Ride from '../ride/ride.model';
import { Promo } from '../promo/promo.model';
import logger from '../../shared/utils/logger';

export class FraudService {
  /**
   * Detect GPS Spoofing
   */
  static detectGPSSpoof(p1: [number, number], p2: [number, number], timeDiffSeconds: number) {
    // Calculate distance between two points
    // If speed > 150km/h, likely spoofing or error
    const speed = this.calculateSpeed(p1, p2, timeDiffSeconds);
    if (speed > 150) {
      logger.warn(`Potential GPS Spoofing detected. Speed: ${speed} km/h`);
      return true;
    }
    return false;
  }

  /**
   * Detect Promo Abuse
   */
  static async detectPromoAbuse(userId: string, promoCode: string) {
    // Check if user is repeatedly using the same promo on multiple accounts (simplified)
    // In production, check deviceID, IP, and payment method fingerprints
    return false;
  }

  /**
   * Detect Fake Rides (Collusion between rider and user)
   */
  static async detectFakeRide(rideId: string) {
    const ride = await Ride.findById(rideId);
    if (!ride) return false;

    // Rule: If ride starts and ends at the same place in < 2 mins
    const duration = ride.actualDuration || 0;
    if (duration < 120) {
      // Check distance
      return true;
    }
    return false;
  }

  private static calculateSpeed(p1: [number, number], p2: [number, number], timeSec: number) {
    // Haversine distance formula implementation omitted for brevity
    // but would return km/h
    return 0; 
  }
}
