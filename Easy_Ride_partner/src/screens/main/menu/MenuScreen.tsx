import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../../theme';
import { MainStackParamList } from '../../../navigation/types';
import { MenuHeader } from '../../../components/menu/MenuHeader';
import { QuickActionCard } from '../../../components/menu/QuickActionCard';
import { OperationalShortcutCard } from '../../../components/menu/OperationalShortcutCard';
import { MenuSection } from '../../../components/menu/MenuSection';
import { SettingsItem } from '../../../components/settings/SettingsItem';

type MenuScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const MenuScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const [isOnline, setIsOnline] = useState(true);

  // Hardcoded Rider Details for demonstration
  const driverName = 'Rampravesh Kumar';
  const rating = 4.88;
  const vehicleModel = 'Maruti Suzuki WagonR';
  const vehiclePlate = 'DL 1CA 1234';

  const toggleOnlineStatus = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOnline(!isOnline);
    Alert.alert(
      isOnline ? 'Going Offline' : 'Going Online',
      isOnline 
        ? 'You will stop receiving new ride request dispatches.' 
        : 'You are now online and will receive nearby ride bookings.'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.appBar, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.appBarLeft}>
          <Text style={[styles.appBarTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            Control Center
          </Text>
        </View>
        
        {/* Quick Duty Switch */}
        <View style={[styles.dutyContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[
            styles.dutyText, 
            { 
              color: isOnline ? theme.colors.success : theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.bold 
            }
          ]}>
            {isOnline ? 'DUTY ON' : 'DUTY OFF'}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={toggleOnlineStatus}
            trackColor={{ false: '#3A3A3C', true: 'rgba(76, 175, 80, 0.3)' }}
            thumbColor={isOnline ? theme.colors.success : '#AEAEB2'}
            ios_backgroundColor="#3A3A3C"
            style={styles.dutySwitch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Menu Header with Profile, Rating and Vehicle */}
        <MenuHeader
          name={driverName}
          rating={rating}
          vehicleModel={vehicleModel}
          vehiclePlate={vehiclePlate}
          isVerified={true}
        />

        {/* Operational Stat Shortcut Cards */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Daily Shift Snapshot
        </Text>
        
        <View style={styles.shortcutsRow}>
          <View style={styles.shortcutCol}>
            <OperationalShortcutCard
              title="Today's Earnings"
              value="₹1,842.50"
              icon="cash-outline"
              progress={0.73} // 73% of daily target
              footerText="Daily Goal: ₹2,500"
              footerIcon="trending-up"
              onPress={() => navigation.navigate('HomeTabs', { screen: 'Earnings' })}
            />
          </View>
          <View style={styles.shortcutCol}>
            <OperationalShortcutCard
              title="Online Hours"
              value="5.8 hrs"
              icon="time-outline"
              progress={0.6} // 60% of shift goal
              footerText="Target: 8.0 hrs"
              footerIcon="stopwatch-outline"
              onPress={() => Alert.alert('Duty Hours', 'You have been online for 5 hours and 48 minutes today.')}
            />
          </View>
        </View>

        {/* Grid of Quick Action Panels */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: 8 }]}>
          Quick Utility Dispatches
        </Text>

        <View style={styles.quickActionGrid}>
          <QuickActionCard
            title="Safety Live SOS"
            subtitle="Emergency Help"
            icon="shield-checkmark"
            iconColor={theme.colors.danger}
            iconBgColor="rgba(255, 69, 58, 0.1)"
            onPress={() => navigation.navigate('SafetyCenter')}
          />
          <QuickActionCard
            title="Inbox Alerts"
            subtitle="Unread Messages"
            icon="notifications"
            iconColor={theme.colors.primary}
            iconBgColor="rgba(245, 184, 0, 0.1)"
            badgeCount={3}
            onPress={() => navigation.navigate('Notifications')}
          />
          <QuickActionCard
            title="Wallet Balance"
            subtitle="₹4,230.12"
            icon="wallet"
            iconColor="#007AFF"
            iconBgColor="rgba(0, 122, 255, 0.1)"
            onPress={() => navigation.navigate('HomeTabs', { screen: 'Wallet' })}
          />
        </View>

        {/* Detailed Operational Menu Links */}
        <View style={styles.menuLinksContainer}>
          <MenuSection title="Compliance & Performance">
            <SettingsItem
              icon="document-text-outline"
              iconColor={theme.colors.primary}
              iconBgColor="rgba(245, 184, 0, 0.1)"
              title="Compliance Documents"
              description="Review driving licenses, badges & permits"
              onPress={() => navigation.navigate('Documents')}
            />
            <SettingsItem
              icon="trending-up-outline"
              iconColor="#4CAF50"
              iconBgColor="rgba(76, 175, 80, 0.1)"
              title="Earnings & Incentives Dashboard"
              description="Detailed payouts, bonuses & trip receipts"
              onPress={() => navigation.navigate('HomeTabs', { screen: 'Earnings' })}
            />
            <SettingsItem
              icon="car-outline"
              iconColor="#007AFF"
              iconBgColor="rgba(0, 122, 255, 0.1)"
              title="Operational History"
              description="View completed trips and rating logs"
              onPress={() => navigation.navigate('HomeTabs', { screen: 'Rides' })}
              showBorder={false}
            />
          </MenuSection>

          <MenuSection title="Safety & Operational Help">
            <SettingsItem
              icon="shield-outline"
              iconColor={theme.colors.danger}
              iconBgColor="rgba(255, 69, 58, 0.1)"
              title="Safety Center & Contacts"
              description="Emergency sharing & safety options"
              onPress={() => navigation.navigate('SafetyCenter')}
            />
            <SettingsItem
              icon="chatbubble-ellipses-outline"
              iconColor="#8E8E93"
              iconBgColor="rgba(142, 142, 147, 0.1)"
              title="Help & Support Desk"
              description="Dispute a trip fare, report app bugs"
              onPress={() => navigation.navigate('Support')}
              showBorder={false}
            />
          </MenuSection>

          <MenuSection title="Preferences & Platform">
            <SettingsItem
              icon="settings-outline"
              iconColor="#007AFF"
              iconBgColor="rgba(0, 122, 255, 0.1)"
              title="System Settings"
              description="Navigation, themes, alerts, notifications"
              onPress={() => navigation.navigate('Settings')}
              showBorder={false}
            />
          </MenuSection>
        </View>

        {/* Footer Version Details */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
            Easy Ride Partner App • v2.4.0 (Enterprise)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  appBarLeft: {
    flex: 1,
  },
  appBarTitle: {
    fontSize: 22,
  },
  dutyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  dutyText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  dutySwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    marginBottom: 12,
    paddingLeft: 4,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shortcutCol: {
    flex: 1,
  },
  quickActionGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  menuLinksContainer: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
});

export default MenuScreen;
