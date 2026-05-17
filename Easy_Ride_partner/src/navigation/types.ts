export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  PhoneLogin: undefined;
  GoogleLogin: undefined;
  OtpVerification: {
    type: 'phone' | 'email';
    value: string;
    nextScreen: keyof AuthStackParamList;
  };
  RiderRegistration: undefined;
  VehicleRegistration: undefined;
  DocumentUpload: undefined;
  ApprovalPending: undefined;
  RejectedVerification: {
    reasons: string[];
  } | undefined;
  AccountApproved: undefined;
};

export type MainStackParamList = {
  HomeTabs: undefined;
  RideDetails: { rideId: string };
  RideRequest: { rideId: string };
  Earnings: undefined;
  Wallet: undefined;
  Profile: undefined;
  Settings: undefined;
  Chat: { rideId: string };
  Support: undefined;
  Notifications: undefined;
};

export type TabParamList = {
  Home: undefined;
  Rides: undefined;
  Earnings: undefined;
  Profile: undefined;
};
