import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { Onboarding1Screen } from '../screens/onboarding/Onboarding1Screen';
import { Onboarding2Screen } from '../screens/onboarding/Onboarding2Screen';
import { Onboarding3Screen } from '../screens/onboarding/Onboarding3Screen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { PhoneAuthScreen } from '../screens/auth/PhoneAuthScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { CompleteProfileScreen } from '../screens/auth/CompleteProfileScreen';
import { EnableLocationScreen } from '../screens/auth/EnableLocationScreen';
import { NotificationPermissionScreen } from '../screens/auth/NotificationPermissionScreen';
import { BiometricSetupScreen } from '../screens/auth/BiometricSetupScreen';
import { CongratulationsScreen } from '../screens/auth/CongratulationsScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="EnableLocation" component={EnableLocationScreen} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
      <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
    </Stack.Navigator>
  );
};
