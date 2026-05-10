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
    nextScreen: string; 
  };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
