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
  PaymentSuccess: { paymentMethod: string; amount: string; transactionId: string };
  Review: undefined;
  CancelRide: undefined;
  Wallet: undefined;
  AddAmount: undefined;
  AddCard: undefined;
  AddSuccess: { amount: string; transactionId: string };
  Offer: undefined;
  Profile: undefined;
  Menu: undefined;
  History: undefined;
  Complain: undefined;
  Referral: undefined;
  AboutUs: undefined;
  Address: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  ChangeLanguage: undefined;
  PrivacyPolicy: undefined;
  ContactUs: undefined;
  DeleteAccount: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  EnableLocation: undefined;
  Welcome: undefined;
  PhoneAuth: undefined;
  NotificationPermission: undefined;
  BiometricSetup: undefined;
  OtpVerification: { 
    type: 'phone' | 'email'; 
    value: string;
    nextScreen: keyof AuthStackParamList;
    confirmationResult?: any;
  };
  CompleteProfile: undefined;
  Congratulations: { 
    title: string; 
    message: string; 
    nextScreen: keyof RootStackParamList | keyof AuthStackParamList; 
  };
};

