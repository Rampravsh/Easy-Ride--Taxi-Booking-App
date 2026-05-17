import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../../theme';
import { MainStackParamList } from '../../../navigation/types';
import { SettingsSection } from '../../../components/settings/SettingsSection';
import { SettingsItem } from '../../../components/settings/SettingsItem';
import { ToggleSettingCard } from '../../../components/settings/ToggleSettingCard';

type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Temporary mock typing for navigation purposes if types are not updated yet
interface NavigationPropExtended extends SettingsScreenNavigationProp {
  navigate: any;
}

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationPropExtended>();
  
  // Operational toggles directly inside main settings screen
  const [autoAccept, setAutoAccept] = useState(false);
  const [highAccuracyGps, setHighAccuracyGps] = useState(true);

  const handleAutoAcceptChange = async (val: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAutoAccept(val);
    if (val) {
      Alert.alert(
        'Auto-Accept Active',
        'Incoming ride dispatch request requests will be automatically accepted to maximize acceptance rate.'
      );
    }
  };

  const handleGpsChange = async (val: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHighAccuracyGps(val);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out Partner',
      'Are you sure you want to end your shift and log out of the Easy Ride Partner platform?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Session Terminated', 'You have successfully logged out.');
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Settings & Preferences
        </Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Operational Instant Configuration Cards */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Co-Pilot Dispatch Controls
        </Text>

        <ToggleSettingCard
          icon="flash"
          iconColor="#F5B800"
          iconBgColor="rgba(245, 184, 0, 0.1)"
          title="Auto-Accept Incoming Rides"
          description="Instantly accept booking requests matching vehicle criteria"
          value={autoAccept}
          onValueChange={handleAutoAcceptChange}
          statusText={autoAccept ? 'AUTO-ACCEPT DISPATCH ON' : 'AUTO-ACCEPT DISPATCH OFF'}
        />

        <ToggleSettingCard
          icon="navigate"
          iconColor="#4CAF50"
          iconBgColor="rgba(76, 175, 80, 0.1)"
          title="High Precision GPS Tracking"
          description="Send live, low-latency telemetry updates for optimal navigation and safety"
          value={highAccuracyGps}
          onValueChange={handleGpsChange}
          statusText={highAccuracyGps ? 'PRECISE POSITIONING ACTIVE' : 'STANDARD POSITIONING'}
        />

        {/* Grouped Settings Rows */}
        <View style={styles.sectionsContainer}>
          
          <SettingsSection title="Hardware & Dispatch Alerts">
            <SettingsItem
              icon="notifications-outline"
              iconColor="#FF9500"
              iconBgColor="rgba(255, 149, 0, 0.1)"
              title="Notification Preferences"
              description="Dispatch pings, pay receipts, sound patterns"
              onPress={() => navigation.navigate('NotificationPreferences')}
            />
            <SettingsItem
              icon="map-outline"
              iconColor="#4CAF50"
              iconBgColor="rgba(76, 175, 80, 0.1)"
              title="App & Map Preferences"
              description="Default mapping apps, voice instructions, screen mode"
              onPress={() => navigation.navigate('AppPreferences')}
              showBorder={false}
            />
          </SettingsSection>

          <SettingsSection title="Localization & Support">
            <SettingsItem
              icon="globe-outline"
              iconColor="#007AFF"
              iconBgColor="rgba(0, 122, 255, 0.1)"
              title="Language & Regional Settings"
              description="Choose interface dialect and unit systems"
              onPress={() => navigation.navigate('Language')}
            />
            <SettingsItem
              icon="lock-closed-outline"
              iconColor="#E53935"
              iconBgColor="rgba(229, 57, 53, 0.1)"
              title="Privacy & Security"
              description="Permissions, security logs, Firebase auth, safety actions"
              onPress={() => navigation.navigate('PrivacySecurity')}
              showBorder={false}
            />
          </SettingsSection>

          <SettingsSection title="Operational Shift Session">
            <SettingsItem
              icon="log-out-outline"
              iconColor={theme.colors.danger}
              iconBgColor={theme.isDark ? 'rgba(255, 69, 58, 0.15)' : 'rgba(229, 57, 53, 0.08)'}
              title="End Shift & Log Out"
              description="Terminate the current active terminal session"
              onPress={handleLogout}
              showArrow={false}
              destructive={true}
              showBorder={false}
            />
          </SettingsSection>
        </View>

        {/* Footer legal notices */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
            Easy Ride Inc. • Operating under License G-318492
          </Text>
          <Text style={[styles.footerSubText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Secure TLS 1.3 Encryption Active
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
  },
  rightSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 15,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionsContainer: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  footerSubText: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});

export default SettingsScreen;
