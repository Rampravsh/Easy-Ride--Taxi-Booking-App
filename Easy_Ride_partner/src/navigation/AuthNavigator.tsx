import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Import Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { Onboarding1Screen } from '../screens/onboarding/Onboarding1Screen';
import { Onboarding2Screen } from '../screens/onboarding/Onboarding2Screen';
import { Onboarding3Screen } from '../screens/onboarding/Onboarding3Screen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { PhoneLoginScreen } from '../screens/auth/PhoneLoginScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { GoogleLoginScreen } from '../screens/auth/GoogleLoginScreen';
import { RiderRegistrationScreen } from '../screens/auth/RiderRegistrationScreen';
import { VehicleRegistrationScreen } from '../screens/auth/VehicleRegistrationScreen';
import { DocumentUploadScreen } from '../screens/auth/DocumentUploadScreen';
import { ApprovalPendingScreen } from '../screens/auth/ApprovalPendingScreen';
import { RejectedVerificationScreen } from '../screens/auth/RejectedVerificationScreen';
import { AccountApprovedScreen } from '../screens/auth/AccountApprovedScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Splash" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      
      {/* Phone Login is the entry for SignIn/SignUp */}
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="SignIn" component={PhoneLoginScreen} />
      <Stack.Screen name="SignUp" component={RiderRegistrationScreen} />
      
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
      <Stack.Screen name="RiderRegistration" component={RiderRegistrationScreen} />
      <Stack.Screen name="VehicleRegistration" component={VehicleRegistrationScreen} />
      <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
      <Stack.Screen name="ApprovalPending" component={ApprovalPendingScreen} />
      <Stack.Screen name="RejectedVerification" component={RejectedVerificationScreen} />
      <Stack.Screen name="AccountApproved" component={AccountApprovedScreen} />
    </Stack.Navigator>
  );
};
