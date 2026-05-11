export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Search: undefined;
  Notification: undefined;
  SelectLocation: undefined;
  SelectTransport: undefined;
  AvailableCars: undefined;
  CarDetails: { carId: string };
  RequestRent: { carId: string };
  PaymentMethod: undefined;
  ThankYou: undefined;
  RideTracking: undefined;
  Chat: undefined;
  Calling: undefined;
  Talk: undefined;
  FinalPayment: undefined;
  PaymentSuccess: undefined;
  Review: undefined;
  CancelRide: undefined;
  Wallet: undefined;
  AddAmount: undefined;
  AddCard: undefined;
  AddSuccess: { amount: string };
  Offer: undefined;
  Profile: undefined;
  Menu: undefined;
  History: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  EnableLocation: undefined;
  Welcome: undefined;
  SignUp: undefined;
  SignIn: undefined;
  OtpVerification: { 
    type: 'phone' | 'email'; 
    value: string;
    nextScreen: keyof AuthStackParamList;
  };
  SetPassword: { isNew?: boolean };
  CompleteProfile: undefined;
  ForgotPassword: undefined;
  Congratulations: { 
    title: string; 
    message: string; 
    nextScreen: keyof RootStackParamList | keyof AuthStackParamList; 
  };
};
