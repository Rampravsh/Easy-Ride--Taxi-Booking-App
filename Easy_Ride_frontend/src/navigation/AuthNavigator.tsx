import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { Onboarding1Screen } from '../screens/auth/Onboarding1Screen';
import { Onboarding2Screen } from '../screens/auth/Onboarding2Screen';
import { Onboarding3Screen } from '../screens/auth/Onboarding3Screen';
import { EnableLocationScreen } from '../screens/auth/EnableLocationScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { SetPasswordScreen } from '../screens/auth/SetPasswordScreen';
import { CompleteProfileScreen } from '../screens/auth/CompleteProfileScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { CongratulationsScreen } from '../screens/auth/CongratulationsScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
      <Stack.Screen name="EnableLocation" component={EnableLocationScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="SetPassword" component={SetPasswordScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Congratulations" component={CongratulationsScreen} />
    </Stack.Navigator>
  );
};
