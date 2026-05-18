import { Ride, RideType, RideStatus } from '../types/ride';

export const RideService = {
  /**
   * Translates backend RideType to human-readable strings.
   */
  getRideTypeName(type: RideType): string {
    switch (type) {
      case 'bike':
        return 'Easy Ride Bike';
      case 'auto':
        return 'Easy Auto Rickshaw';
      case 'cab':
        return 'Standard Cab';
      default:
        return 'Ride';
    }
  },

  /**
   * Formats distance in meters to a human-readable string.
   */
  formatDistance(meters: number): string {
    if (!meters && meters !== 0) return '0 m';
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  },

  /**
   * Formats duration in seconds to a human-readable duration (e.g. "5 mins").
   */
  formatDuration(seconds: number): string {
    if (!seconds && seconds !== 0) return '0 mins';
    const mins = Math.round(seconds / 60);
    if (mins < 60) {
      return `${mins} mins`;
    }
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs} hr ${remainingMins} mins`;
  },

  /**
   * Maps backend RideStatus to human-friendly status messages.
   */
  getStatusLabel(status: RideStatus): string {
    switch (status) {
      case 'searching':
        return 'Searching for nearby drivers...';
      case 'accepted':
        return 'Driver is heading your way';
      case 'arriving':
        return 'Driver is arriving at pickup';
      case 'arrived':
        return 'Driver has arrived at pickup';
      case 'started':
        return 'Ride in progress';
      case 'completed':
        return 'Ride completed successfully';
      case 'cancelled':
        return 'Ride has been cancelled';
      default:
        return 'Processing your ride...';
    }
  },

  /**
   * Returns a progress mapping for status indicators.
   */
  getStatusProgress(status: RideStatus): number {
    switch (status) {
      case 'searching':
        return 0.15;
      case 'accepted':
        return 0.4;
      case 'arriving':
        return 0.55;
      case 'arrived':
        return 0.65;
      case 'started':
        return 0.85;
      case 'completed':
        return 1.0;
      case 'cancelled':
        return 0.0;
      default:
        return 0.0;
    }
  },

  /**
   * Transforms the backend Ride schema into the shape expected by legacy screens.
   * Eliminates the risk of undefined object fields crashing the views.
   */
  transformRideForUI(ride: Ride | null): any {
    if (!ride) return null;

    // Handle populated or unpopulated rider and vehicle details
    const backendRider = typeof ride.rider === 'object' ? ride.rider : null;
    const backendVehicle = typeof ride.vehicle === 'object' ? ride.vehicle : null;

    // Create the driver object matching legacy UI specifications
    const driver = backendRider
      ? {
          id: backendRider._id,
          name: backendRider.fullName,
          avatar: backendRider.profileImage
            ? { uri: backendRider.profileImage }
            : require('../../assets/images/driver_sergio.png'),
          rating: backendRider.averageRating || 5.0,
          totalReviews: backendRider.totalTrips || 12,
          status: backendRider.isAvailable ? 'available' : 'busy',
          phone: backendRider.phone || '',
        }
      : {
          id: 'searching',
          name: 'Locating Driver...',
          avatar: require('../../assets/images/driver_sergio.png'),
          rating: 5.0,
          totalReviews: 0,
          status: 'busy',
          phone: '',
        };

    // Create the vehicle object matching legacy UI specifications
    const car = backendVehicle
      ? {
          id: backendVehicle._id,
          name: `${backendVehicle.brand} ${backendVehicle.modelName}`,
          type: ride.rideType,
          category: ride.rideCategory,
          image: backendVehicle.vehicleImage
            ? { uri: backendVehicle.vehicleImage }
            : require('../../assets/images/red_mustang.png'),
          rating: backendRider?.averageRating || 5.0,
          reviews: backendRider?.totalTrips || 12,
          pricePerHour: ride.totalFare,
          numberPlate: backendVehicle.numberPlate,
          color: backendVehicle.color,
        }
      : {
          id: 'searching',
          name: this.getRideTypeName(ride.rideType),
          type: ride.rideType,
          category: ride.rideCategory,
          image: require('../../assets/images/red_mustang.png'),
          rating: 5.0,
          reviews: 0,
          pricePerHour: ride.totalFare,
          numberPlate: '---',
          color: '---',
        };

    return {
      id: ride._id,
      car,
      driver,
      pickupLocation: ride.pickupLocation.address,
      destinationLocation: ride.dropLocation.address,
      pickupCoordinates: ride.pickupLocation.coordinates,
      destinationCoordinates: ride.dropLocation.coordinates,
      distance: this.formatDistance(ride.estimatedDistance),
      duration: this.formatDuration(ride.estimatedDuration),
      status: ride.status,
      otp: ride.otp || '----',
      rawRide: ride, // Preserve raw backend model
      charges: {
        baseFare: ride.baseFare,
        vat: ride.taxAmount,
        promoDiscount: 0,
        total: ride.totalFare,
      },
      paymentMethod: {
        id: ride.paymentMethod,
        label:
          ride.paymentMethod === 'wallet'
            ? 'Personal Wallet'
            : ride.paymentMethod === 'cash'
            ? 'Cash Payment'
            : 'Linked Card',
        type:
          ride.paymentMethod === 'wallet'
            ? 'Wallet'
            : ride.paymentMethod === 'cash'
            ? 'Cash'
            : 'Card',
      },
    };
  },
};
