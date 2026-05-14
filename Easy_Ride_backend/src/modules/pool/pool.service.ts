import { Types } from 'mongoose';
import { Pool } from './pool.model';
import { IPoolDocument } from './pool.interface';
import { PoolStatus } from '../../shared/enums';
import { PricingService } from '../pricing/pricing.service';
import { ApiError } from '../../shared/errors/ApiError';
import httpStatus from 'http-status';

export class PoolService {
  /**
   * Find or Create a Pool for a ride request
   */
  async findOrCreatePool(params: {
    rideId: string;
    userId: string;
    pickup: any;
    drop: any;
    seats: number;
    fare: number;
  }) {
    const { rideId, userId, pickup, drop, seats, fare } = params;

    // 1. Logic to find a matching nearby pool (nearby route matching)
    // Simplified: Look for available pools with the same route pattern
    // In production, use Google Maps Route similarity or a custom GEO path matching algorithm
    const existingPool = await Pool.findOne({
      status: PoolStatus.AVAILABLE,
      availableSeats: { $gte: seats },
      // Add spatial filtering here
    });

    if (existingPool) {
      return await this.joinPool(existingPool._id.toString(), { userId, rideId, pickup, drop, seats, fare });
    }


    // 2. Create new pool if no match found
    const pool = await Pool.create({
      mainRide: new Types.ObjectId(rideId),
      availableSeats: 4 - seats, // assuming 4 max seats
      maxSeats: 4,
      status: PoolStatus.AVAILABLE,
      passengers: [{
        user: new Types.ObjectId(userId),
        ride: new Types.ObjectId(rideId),
        seats,
        pickupLocation: pickup,
        dropLocation: drop,
        fare,
        joinedAt: new Date(),
      }],
    });

    return pool;
  }

  /**
   * Join an existing pool
   */
  async joinPool(poolId: string, passenger: any) {
    const pool = await Pool.findById(poolId);
    if (!pool || pool.status !== PoolStatus.AVAILABLE) {
      throw new ApiError('Pool is no longer available', httpStatus.GONE);
    }

    if (pool.availableSeats < passenger.seats) {
      throw new ApiError('Not enough seats available', httpStatus.BAD_REQUEST);
    }

    pool.passengers.push({
      ...passenger,
      user: new Types.ObjectId(passenger.userId),
      ride: new Types.ObjectId(passenger.rideId),
      joinedAt: new Date(),
    });
    
    pool.availableSeats -= passenger.seats;
    
    if (pool.availableSeats === 0) {
      pool.status = PoolStatus.MATCHING;
    }

    await pool.save();
    return pool;
  }

  /**
   * Leave a pool
   */
  async leavePool(poolId: string, userId: string) {
    const pool = await Pool.findById(poolId);
    if (!pool) throw new ApiError('Pool not found', httpStatus.NOT_FOUND);

    const passengerIndex = pool.passengers.findIndex(p => p.user.toString() === userId);
    if (passengerIndex === -1) throw new ApiError('User not in pool', httpStatus.NOT_FOUND);

    const removedPassenger = pool.passengers.splice(passengerIndex, 1)[0];
    pool.availableSeats += removedPassenger.seats;
    pool.status = PoolStatus.AVAILABLE;

    await pool.save();
    return pool;
  }
}
