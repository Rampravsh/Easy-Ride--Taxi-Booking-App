import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStackParamList, TabParamList } from './types';
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={() => <PlaceholderScreen name="Home" />} />
      <Tab.Screen name="Rides" component={() => <PlaceholderScreen name="Rides" />} />
      <Tab.Screen name="Earnings" component={() => <PlaceholderScreen name="Earnings" />} />
      <Tab.Screen name="Profile" component={() => <PlaceholderScreen name="Profile" />} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      <Stack.Screen name="RideDetails" component={() => <PlaceholderScreen name="RideDetails" />} />
    </Stack.Navigator>
  );
};
