import { Document, Types } from 'mongoose';
import { PoolStatus } from '../../shared/enums';

export interface IPoolPassenger {
  user: Types.ObjectId;
  ride: Types.ObjectId;
  seats: number;
  pickupLocation: {
    type: 'Point';
    coordinates: number[];
    address: string;
  };
  dropLocation: {
    type: 'Point';
    coordinates: number[];
    address: string;
  };
  fare: number;
  joinedAt: Date;
}

export interface IPool {
  mainRide: Types.ObjectId;
  rider?: Types.ObjectId;
  passengers: IPoolPassenger[];
  availableSeats: number;
  maxSeats: number;
  route: {
    polyline: string;
    waypoints: any[];
  };
  status: PoolStatus;
  timestamps: {
    startedAt?: Date;
    endedAt?: Date;
  };
}

export interface IPoolDocument extends IPool, Document {}
