import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Screens
import { HomeScreen } from '../screens/main/home/HomeScreen';
import { SearchScreen } from '../screens/main/location/SearchScreen';
import { NotificationScreen } from '../screens/main/notification/NotificationScreen';
import { SelectLocationScreen } from '../screens/main/location/SelectLocationScreen';
import { SelectTransportScreen } from '../screens/main/transport/SelectTransportScreen';
import { AvailableCarsScreen } from '../screens/main/transport/AvailableCarsScreen';
import { CarDetailsScreen } from '../screens/main/transport/CarDetailsScreen';
import { RequestRentScreen } from '../screens/main/transport/RequestRentScreen';
import { PaymentMethodScreen } from '../screens/main/transport/PaymentMethodScreen';
import { ThankYouScreen } from '../screens/main/transport/ThankYouScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Placeholder = ({ name }: { name: string }) => {
  const { theme } = useTheme();
  return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
};

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Favourite" 
        component={() => <Placeholder name="Favourite" />} 
        options={{
          tabBarLabel: 'Favourite',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={() => <Placeholder name="Wallet" />} 
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.walletButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="wallet" size={28} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Offer" 
        component={() => <Placeholder name="Offer" />} 
        options={{
          tabBarLabel: 'Offer',
          tabBarIcon: ({ color }) => <Ionicons name="pricetag" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={() => <Placeholder name="Profile" />} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="SelectLocation" component={SelectLocationScreen} />
      <Stack.Screen name="SelectTransport" component={SelectTransportScreen} />
      <Stack.Screen name="AvailableCars" component={AvailableCarsScreen} />
      <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
      <Stack.Screen name="RequestRent" component={RequestRentScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="ThankYou" component={ThankYouScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  walletButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
