import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStackParamList, TabParamList } from './types';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Import Screens
import { HomeScreen } from '../screens/main/home/HomeScreen';
import { IncomingRideScreen } from '../screens/main/rides/IncomingRideScreen';
import { EarningsDashboardScreen } from '../screens/main/earnings/EarningsDashboardScreen';

const PlaceholderScreen = ({ name }: { name: string }) => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>{name} Screen</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Rides') {
            iconName = 'car';
          } else if (route.name === 'Earnings') {
            iconName = 'wallet';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rides" component={() => <PlaceholderScreen name="Rides" />} />
      <Tab.Screen name="Earnings" component={EarningsDashboardScreen} />
      <Tab.Screen name="Profile" component={() => <PlaceholderScreen name="Profile" />} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      <Stack.Screen name="RideDetails" component={() => <PlaceholderScreen name="RideDetails" />} />
      <Stack.Screen name="IncomingRide" component={IncomingRideScreen} />
    </Stack.Navigator>
  );
};
