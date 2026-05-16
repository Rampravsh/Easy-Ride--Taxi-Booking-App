import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RideStackParamList } from './types';

// Placeholder screens for ride lifecycle
import NewRequest from '../screens/main/home/HomeScreen'; // Reusing for now or creating new
import NavigateToPickup from '../screens/main/rides/NavigateToPickup';
import Arrived from '../screens/main/rides/Arrived';
import StartRide from '../screens/main/rides/StartRide';
import LiveTracking from '../screens/main/rides/LiveTracking';
import CompleteRide from '../screens/main/rides/CompleteRide';

const Stack = createNativeStackNavigator<RideStackParamList>();

export const RideNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NavigateToPickup" component={NavigateToPickup} />
      <Stack.Screen name="Arrived" component={Arrived} />
      <Stack.Screen name="StartRide" component={StartRide} />
      <Stack.Screen name="LiveTracking" component={LiveTracking} />
      <Stack.Screen name="CompleteRide" component={CompleteRide} />
    </Stack.Navigator>
  );
};
