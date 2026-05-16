import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import RiderRegistrationScreen from '../screens/auth/RiderRegistrationScreen';
import VehicleRegistrationScreen from '../screens/auth/VehicleRegistrationScreen';
import DocumentUploadScreen from '../screens/auth/DocumentUploadScreen';
import ApprovalPendingScreen from '../screens/auth/ApprovalPendingScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={PhoneLoginScreen} />
      <Stack.Screen name="OTP" component={OTPVerificationScreen} />
      <Stack.Screen name="Register" component={RiderRegistrationScreen} />
      <Stack.Screen name="VehicleRegistration" component={VehicleRegistrationScreen} />
      <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
      <Stack.Screen name="ApprovalPending" component={ApprovalPendingScreen} />
    </Stack.Navigator>
  );
};
