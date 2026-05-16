export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Ride: { rideId: string };
};

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  OTP: { phone: string };
  Register: undefined;
  VehicleRegistration: undefined;
  DocumentUpload: undefined;
  ApprovalPending: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Rides: undefined;
  Earnings: undefined;
  Wallet: undefined;
  Profile: undefined;
};

export type RideStackParamList = {
  NewRequest: { request: any };
  NavigateToPickup: { ride: any };
  Arrived: { ride: any };
  StartRide: { ride: any };
  LiveTracking: { ride: any };
  CompleteRide: { ride: any };
};
