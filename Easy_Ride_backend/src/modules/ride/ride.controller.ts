import { Request, Response, NextFunction } from 'express';
import { RideService } from './ride.service';
import { ApiResponse } from '../../shared/utils/apiResponse';

const rideService = new RideService();

export const requestRide = async (req: any, res: Response, next: NextFunction) => {
  try {
    const result = await rideService.requestRide(req.user.id, req.body);
    ApiResponse.success(res, 'Ride requested successfully', result, 201);
  } catch (error) {
    next(error);
  }
};

export const acceptRide = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { riderId } = req.body; // In a real app, this might come from req.user if they are a rider
    const ride = await rideService.acceptRide(req.params.id, riderId);
    ApiResponse.success(res, 'Ride accepted', ride);
  } catch (error) {
    next(error);
  }
};

export const startRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp } = req.body;
    const ride = await rideService.startRide(req.params.id, otp);
    ApiResponse.success(res, 'Ride started', ride);
  } catch (error) {
    next(error);
  }
};

export const completeRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ride = await rideService.completeRide(req.params.id);
    ApiResponse.success(res, 'Ride completed', ride);
  } catch (error) {
    next(error);
  }
};
