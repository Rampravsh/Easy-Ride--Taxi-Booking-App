import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Navigation Screens Registration
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Screens
import { HomeScreen } from '../screens/main/home/HomeScreen';
import { SearchScreen } from '../screens/main/location/SearchScreen';
import { WalletScreen } from '../screens/main/wallet/WalletScreen';
import { AddAmountScreen } from '../screens/main/wallet/AddAmountScreen';
import { AddCardScreen } from '../screens/main/wallet/AddCardScreen';
import { AddSuccessScreen } from '../screens/main/wallet/AddSuccessScreen';
import { OfferScreen } from '../screens/main/offer/OfferScreen';
import { ProfileScreen } from '../screens/main/profile/ProfileScreen';
import { NotificationScreen } from '../screens/main/notification/NotificationScreen';
import { FavouriteScreen } from '../screens/main/favourite/FavouriteScreen';
import { MenuScreen } from '../screens/main/menu/MenuScreen';
import { HistoryScreen } from '../screens/main/History/HistoryScreen';
import { ComplainScreen } from '../screens/main/complain/ComplainScreen';
import { ReferralScreen } from '../screens/main/referral/ReferralScreen';
import { AboutUsScreen } from '../screens/main/about/AboutUsScreen';
import { AddressScreen } from '../screens/main/address/AddressScreen';
import { SettingsScreen } from '../screens/main/settings/SettingsScreen';
import { ChangePasswordScreen } from '../screens/main/settings/ChangePasswordScreen';
import { ChangeLanguageScreen } from '../screens/main/settings/ChangeLanguageScreen';
import { PrivacyPolicyScreen } from '../screens/main/settings/PrivacyPolicyScreen';
import { ContactUsScreen } from '../screens/main/settings/ContactUsScreen';
import { DeleteAccountScreen } from '../screens/main/settings/DeleteAccountScreen';
import { SelectLocationScreen } from '../screens/main/location/SelectLocationScreen';
import { SelectTransportScreen } from '../screens/main/transport/SelectTransportScreen';
import { AvailableCarsScreen } from '../screens/main/transport/AvailableCarsScreen';
import { CarDetailsScreen } from '../screens/main/transport/CarDetailsScreen';
import { RequestRentScreen } from '../screens/main/transport/RequestRentScreen';
import { PaymentMethodScreen } from '../screens/main/transport/PaymentMethodScreen';
import { ThankYouScreen } from '../screens/main/transport/ThankYouScreen';
import { RideTrackingScreen } from '../screens/main/transport/RideTrackingScreen';
import { ChatScreen } from '../screens/main/chat/ChatScreen';
import { CallingScreen } from '../screens/main/call/CallingScreen';
import { TalkScreen } from '../screens/main/call/TalkScreen';
import { FinalPaymentScreen } from '../screens/main/transport/FinalPaymentScreen';
import { PaymentSuccessScreen } from '../screens/main/transport/PaymentSuccessScreen';
import { ReviewScreen } from '../screens/main/transport/ReviewScreen';
import { CancelRideScreen } from '../screens/main/transport/CancelRideScreen';

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
        component={FavouriteScreen} 
        options={{
          tabBarLabel: 'Favourite',
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen} 
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
        component={OfferScreen} 
        options={{
          tabBarLabel: 'Offer',
          tabBarIcon: ({ color }) => <Ionicons name="pricetag" size={24} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
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
      <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Calling" component={CallingScreen} />
      <Stack.Screen name="Talk" component={TalkScreen} />
      <Stack.Screen name="FinalPayment" component={FinalPaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="CancelRide" component={CancelRideScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="AddAmount" component={AddAmountScreen} />
      <Stack.Screen name="AddCard" component={AddCardScreen} />
      <Stack.Screen name="AddSuccess" component={AddSuccessScreen} />
      <Stack.Screen 
        name="Menu" 
        component={MenuScreen} 
        options={{ 
          animation: 'slide_from_left',
          presentation: 'transparentModal'
        }} 
      />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Complain" component={ComplainScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguageScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
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
