import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../../theme';
import { SettingsSection } from '../../../components/settings/SettingsSection';
import { SettingsItem } from '../../../components/settings/SettingsItem';
import { ToggleSettingCard } from '../../../components/settings/ToggleSettingCard';
import { DangerActionCard } from '../../../components/settings/DangerActionCard';

export const PrivacySecurityScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Security Toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [shareMetrics, setShareMetrics] = useState(false);

  const handle2FAtoggle = async (val: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTwoFactor(val);
    Alert.alert(
      val ? '2-Factor Authenticated' : '2FA Muted',
      val 
        ? 'A 6-digit OTP code will be sent to your registered phone during every new sign-in attempt.'
        : 'Warning: disabling 2FA decreases account security during terminal access.'
    );
  };

  const handleLocationSettingsPress = () => {
    Alert.alert(
      'Location Access Settings',
      'Location tracking is configured to ALWAYS ALLOW in your system settings. This is mandatory to receive nearby passenger booking dispatches.',
      [
        { text: 'Verify System Settings', onPress: () => Alert.alert('External Link', 'Redirecting to device settings panel...') },
        { text: 'Dismiss', style: 'cancel' }
      ]
    );
  };

  const handleChangePin = () => {
    Alert.alert(
      'Change Verification PIN',
      'Please enter your current 4-digit Easy Ride verification PIN to set a new security credential.',
      [
        { text: 'Verify & Continue', onPress: () => Alert.alert('Success', 'Verification PIN updated successfully!') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'CRITICAL COMPLIANCE NOTICE',
      'Are you absolutely sure you want to request permanent deletion of your Easy Ride Partner Account? All driving compliance badges, historic tax sheets, and pending payouts (₹4,230.12) will be permanently forfeited. This request is reviewed in accordance with municipal transport policies.',
      [
        { text: 'Abort Deletion', style: 'cancel' },
        { 
          text: 'Request Permanent Deletion', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
              'Deletion Request Submitted',
              'Your compliance file deletion request has been registered. An Easy Ride representative will contact you within 48 hours for final verification.'
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* AppBar */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Privacy & Security
        </Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Compliance Location Permission Card */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Location Auditing
        </Text>

        <TouchableOpacity 
          style={[styles.complianceCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={handleLocationSettingsPress}
          activeOpacity={0.8}
        >
          <View style={styles.complianceHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
            <Text style={[styles.complianceTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Location Access: ALWAYS ON
            </Text>
          </View>
          <Text style={[styles.complianceDesc, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Background GPS access is active. This ensures your vehicle maintains accurate dispatch proximity. Tap to check device permissions.
          </Text>
        </TouchableOpacity>

        {/* Security Controls */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: 12 }]}>
          Account Protection
        </Text>

        <ToggleSettingCard
          icon="shield-half"
          iconColor="#007AFF"
          iconBgColor="rgba(0, 122, 255, 0.1)"
          title="Two-Factor OTP Security"
          description="Require a text code confirmation during unrecognized portal sign-ins"
          value={twoFactor}
          onValueChange={handle2FAtoggle}
          statusText={twoFactor ? '2FA ENFORCED' : 'PROTECTION DEGRADED'}
        />

        <ToggleSettingCard
          icon="analytics"
          iconColor="#AEAEB2"
          iconBgColor="rgba(142, 142, 147, 0.1)"
          title="Share Usage Metrics"
          description="Send anonymous network and telemetry crash logs to improve app efficiency"
          value={shareMetrics}
          onValueChange={(val) => setShareMetrics(val)}
          statusText={shareMetrics ? 'DIAGNOSTICS ACTIVE' : 'DIAGNOSTICS OFF'}
        />

        {/* Grouped Lists */}
        <View style={styles.sectionsContainer}>
          <SettingsSection title="Secure Credentials">
            <SettingsItem
              icon="key-outline"
              iconColor={theme.colors.primary}
              iconBgColor="rgba(245, 184, 0, 0.1)"
              title="Reset Easy Ride PIN"
              description="Update your 4-digit rapid-verify device PIN"
              onPress={handleChangePin}
            />
            <SettingsItem
              icon="mail-unread-outline"
              iconColor="#007AFF"
              iconBgColor="rgba(0, 122, 255, 0.1)"
              title="Linked Firebase Auth"
              description="rampravesh.kumar@easyride.in"
              showArrow={false}
              showBorder={false}
            />
          </SettingsSection>

          <SettingsSection title="Connected Sessions">
            <SettingsItem
              icon="hardware-chip-outline"
              iconColor="#4CAF50"
              iconBgColor="rgba(76, 175, 80, 0.1)"
              title="Xiaomi Redmi Note 13 (Current)"
              description="Active in Delhi NCR, IN • Last active: 1s ago"
              showArrow={false}
            />
            <SettingsItem
              icon="desktop-outline"
              iconColor="#8E8E93"
              iconBgColor="rgba(142, 142, 147, 0.1)"
              title="Partner Portal Dashboard"
              description="Chrome Session • Last active: 2 hours ago"
              showArrow={false}
              showBorder={false}
            />
          </SettingsSection>
        </View>

        {/* Danger Zone Account Deletion */}
        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: 12 }]}>
          Danger Compliance Control
        </Text>

        <DangerActionCard
          title="Delete Platform Account"
          description="Irreversibly delete your partner driving record. This action wipes compliance licenses, transaction history, and automatically terminates active dispatcher registries."
          buttonText="Request Account Deletion"
          onPress={handleDeleteAccount}
          icon="trash"
        />

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
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  complianceCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  complianceTitle: {
    fontSize: 14,
  },
  complianceDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionsContainer: {
    marginTop: 8,
  },
});

export default PrivacySecurityScreen;
