import Ride from '../ride/ride.model';
import { RideStatus } from '../../shared/enums';
import dayjs from 'dayjs';

export class AnalyticsService {
  /**
   * Get Real-time Operations Overview
   */
  static async getOpsOverview() {
    const today = dayjs().startOf('day').toDate();
    
    const [
      totalRidesToday,
      activeRides,
      completedRidesToday,
      cancelledRidesToday,
    ] = await Promise.all([
      Ride.countDocuments({ createdAt: { $gte: today } }),
      Ride.countDocuments({ status: { $in: [RideStatus.ACCEPTED, RideStatus.ARRIVING, RideStatus.STARTED] } }),
      Ride.countDocuments({ status: RideStatus.COMPLETED, createdAt: { $gte: today } }),
      Ride.countDocuments({ status: RideStatus.CANCELLED, createdAt: { $gte: today } }),
    ]);

    const successRate = totalRidesToday > 0 ? (completedRidesToday / totalRidesToday) * 100 : 0;

    return {
      totalRidesToday,
      activeRides,
      completedRidesToday,
      cancelledRidesToday,
      successRate: Math.round(successRate * 100) / 100,
    };
  }

  /**
   * Get Revenue Metrics
   */
  static async getRevenueMetrics(startDate: Date, endDate: Date) {
    const revenue = await Ride.aggregate([
      {
        $match: {
          status: RideStatus.COMPLETED,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$totalFare' },
          avgFare: { $avg: '$totalFare' },
          rideCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return revenue;
  }
}
