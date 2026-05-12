import Rider, { IRider } from './rider.model';
import User from '../user/user.model';
import { UserRole } from '../../shared/enums';
import { AppError } from '../../middlewares/error.middleware';

export class RiderService {
  async registerRider(userId: string, riderData: Partial<IRider>) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const existingRider = await Rider.findOne({ user: userId });
    if (existingRider) throw new AppError('Already registered as a rider', 400);

    const rider = await Rider.create({
      ...riderData,
      user: userId,
    });

    user.role = UserRole.RIDER;
    await user.save();

    return rider;
  }

  async getOnlineRiders(location: number[], radius: number = 5000) {
    return await Rider.find({
      isOnline: true,
      isApproved: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location,
          },
          $maxDistance: radius,
        },
      },
    }).populate('user vehicle');
  }

  async updateLocation(riderId: string, coordinates: number[]) {
    return await Rider.findByIdAndUpdate(
      riderId,
      {
        currentLocation: { type: 'Point', coordinates },
        lastActive: new Date(),
      },
      { new: true }
    );
  }

  async toggleOnline(riderId: string, isOnline: boolean) {
    return await Rider.findByIdAndUpdate(riderId, { isOnline }, { new: true });
  }
}
