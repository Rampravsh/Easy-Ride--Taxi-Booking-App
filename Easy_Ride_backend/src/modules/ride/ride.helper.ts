import { RIDE_CONSTANTS, ALLOWED_RIDE_TRANSITIONS } from './ride.constants';
import { RideStatus } from '../../shared/enums';

export class RideHelper {
  /**
   * Calculate fare based on distance and duration
   */
  static calculateFare(distanceInMeters: number, durationInSeconds: number) {
    const distanceInKm = distanceInMeters / 1000;
    const durationInMinutes = durationInSeconds / 60;

    const baseFare = RIDE_CONSTANTS.BASE_FARE;
    const distanceFare = distanceInKm * RIDE_CONSTANTS.PER_KM_CHARGE;
    const timeFare = durationInMinutes * RIDE_CONSTANTS.PER_MINUTE_CHARGE;

    const subTotal = baseFare + distanceFare + timeFare;
    const taxAmount = (subTotal * RIDE_CONSTANTS.TAX_PERCENTAGE) / 100;
    const totalFare = Math.round(subTotal + taxAmount);

    return {
      baseFare: Math.round(baseFare),
      taxAmount: Math.round(taxAmount),
      totalFare: totalFare,
      surgeMultiplier: RIDE_CONSTANTS.SURGE_MULTIPLIER_DEFAULT,
    };
  }

  /**
   * Generate a random numeric OTP
   */
  static generateOTP(): string {
    const length = RIDE_CONSTANTS.OTP_LENGTH;
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  /**
   * Validate status transition
   */
  static isValidTransition(currentStatus: RideStatus, nextStatus: RideStatus): boolean {
    const allowed = ALLOWED_RIDE_TRANSITIONS[currentStatus];
    return allowed ? allowed.includes(nextStatus) : false;
  }
}
