import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStackParamList, TabParamList } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Import Screens
import { HomeScreen } from '../screens/main/home/HomeScreen';
import { IncomingRideScreen } from '../screens/main/rides/IncomingRideScreen';
import { EarningsDashboardScreen } from '../screens/main/earnings/EarningsDashboardScreen';
import { NavigateToPickupScreen } from '../screens/main/rides/NavigateToPickupScreen';
import { RideInProgressScreen } from '../screens/main/rides/RideInProgressScreen';
import { RideCompletedScreen } from '../screens/main/rides/RideCompletedScreen';
import { RideDetailsScreen } from '../screens/main/rides/RideDetailsScreen';
import { WalletScreen } from '../screens/main/wallet/WalletScreen';

// Newly Created Communication, Safety & Support Screens
import { ChatScreen } from '../screens/main/chat/ChatScreen';
import { CallingScreen } from '../screens/main/call/CallingScreen';
import { NotificationScreen } from '../screens/main/notifications/NotificationScreen';
import { SafetyCenterScreen } from '../screens/main/safety/SafetyCenterScreen';
import { IncidentReportScreen } from '../screens/main/safety/IncidentReportScreen';
import { SupportScreen } from '../screens/main/support/SupportScreen';
import { ProfileScreen } from '../screens/main/profile/ProfileScreen';
import { DocumentsScreen } from '../screens/main/profile/DocumentsScreen';

// Newly Created Menu & Settings Screens
import { MenuScreen } from '../screens/main/menu/MenuScreen';
import { SettingsScreen } from '../screens/main/settings/SettingsScreen';
import { NotificationPreferencesScreen } from '../screens/main/settings/NotificationPreferencesScreen';
import { AppPreferencesScreen } from '../screens/main/settings/AppPreferencesScreen';
import { PrivacySecurityScreen } from '../screens/main/settings/PrivacySecurityScreen';
import { LanguageScreen } from '../screens/main/settings/LanguageScreen';

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
            iconName = 'cash';
          } else if (route.name === 'Wallet') {
            iconName = 'wallet';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rides" component={RideDetailsScreen} />
      <Tab.Screen name="Earnings" component={EarningsDashboardScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={TabNavigator} />
      <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
      <Stack.Screen name="IncomingRide" component={IncomingRideScreen} />
      <Stack.Screen name="NavigateToPickup" component={NavigateToPickupScreen} />
      <Stack.Screen name="RideInProgress" component={RideInProgressScreen} />
      <Stack.Screen name="RideCompleted" component={RideCompletedScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      
      {/* Communication, Safety, & Support Stack Registry */}
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Calling" component={CallingScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="SafetyCenter" component={SafetyCenterScreen} />
      <Stack.Screen name="IncidentReport" component={IncidentReportScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />

      {/* Menu & Settings Stack Registry */}
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="AppPreferences" component={AppPreferencesScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
