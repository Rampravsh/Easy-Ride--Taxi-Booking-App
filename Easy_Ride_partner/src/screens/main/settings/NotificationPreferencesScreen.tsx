import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../../theme';
import { ToggleSettingCard } from '../../../components/settings/ToggleSettingCard';

export const NotificationPreferencesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Alert States
  const [dispatchAlerts, setDispatchAlerts] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [incentiveAlerts, setIncentiveAlerts] = useState(true);
  const [supportAlerts, setSupportAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true); // Locked for safety, or toggled

  const handleToggle = async (type: string, currentVal: boolean, setVal: React.Dispatch<React.SetStateAction<boolean>>) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (type === 'Emergency Alerts' && currentVal) {
      Alert.alert(
        'Critical Safety Setting',
        'Emergency and critical dispatch alerts cannot be disabled to ensure compliance with municipal safety regulations.',
        [{ text: 'Acknowledged' }]
      );
      return;
    }

    setVal(!currentVal);
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
          Notification Preferences
        </Text>
        <View style={styles.rightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Intro */}
        <View style={[styles.cardIntro, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="notifications-circle" size={32} color={theme.colors.primary} />
          <Text style={[styles.cardIntroText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
            Tailor how you receive operational alerts. Dispatch dispatches are highly critical and use unique sound overrides.
          </Text>
        </View>

        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Dispatch & Demand Alerts
        </Text>

        <ToggleSettingCard
          icon="car-sport"
          iconColor={theme.colors.primary}
          iconBgColor="rgba(245, 184, 0, 0.1)"
          title="Booking Dispatch Ringtone"
          description="High-vibe recurring sound alerts for incoming ride requests"
          value={dispatchAlerts}
          onValueChange={(val) => handleToggle('Ride Alerts', dispatchAlerts, setDispatchAlerts)}
          statusText={dispatchAlerts ? 'RING & VIBRATE ENABLED' : 'MUTED (NOT RECOMMENDED)'}
        />

        <ToggleSettingCard
          icon="trending-up"
          iconColor="#4CAF50"
          iconBgColor="rgba(76, 175, 80, 0.1)"
          title="Surge & Incentive Alerts"
          description="Receive real-time notifications when your current area goes into active demand surge"
          value={incentiveAlerts}
          onValueChange={(val) => handleToggle('Incentives', incentiveAlerts, setIncentiveAlerts)}
          statusText={incentiveAlerts ? 'DEMAND SURGES ENGAGED' : 'BONUSES UNMONITORED'}
        />

        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: 12 }]}>
          Finance & Administrative Alerts
        </Text>

        <ToggleSettingCard
          icon="wallet"
          iconColor="#007AFF"
          iconBgColor="rgba(0, 122, 255, 0.1)"
          title="Payout & Ledger Receipts"
          description="Get notified instantly on completed rides, weekly deposits, and banking transfers"
          value={payoutAlerts}
          onValueChange={(val) => handleToggle('Payouts', payoutAlerts, setPayoutAlerts)}
          statusText={payoutAlerts ? 'PAYMENT RECEIPTS ENGAGED' : 'LEDGER ONLY'}
        />

        <ToggleSettingCard
          icon="chatbubbles"
          iconColor="#8E8E93"
          iconBgColor="rgba(142, 142, 147, 0.1)"
          title="Support Desk Notifications"
          description="Instant chat updates on active tickets and dispute decisions"
          value={supportAlerts}
          onValueChange={(val) => handleToggle('Support', supportAlerts, setSupportAlerts)}
          statusText={supportAlerts ? 'SUPPORT PINGS ENABLED' : 'DELIVER ON LOGS'}
        />

        <Text style={[styles.sectionHeading, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: 12 }]}>
          Compliance & Safety Alerts
        </Text>

        <ToggleSettingCard
          icon="shield-checkmark"
          iconColor={theme.colors.danger}
          iconBgColor="rgba(255, 69, 58, 0.1)"
          title="Municipal Emergency Dispatch"
          description="Critical safety bulletins, severe weather updates, and server maintenance warnings"
          value={emergencyAlerts}
          onValueChange={(val) => handleToggle('Emergency Alerts', emergencyAlerts, setEmergencyAlerts)}
          statusText="MANDATORY ENGAGED (LOCAL COMPLIANCE)"
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
  cardIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 20,
  },
  cardIntroText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  sectionHeading: {
    fontSize: 15,
    marginBottom: 12,
    paddingLeft: 4,
  },
});

export default NotificationPreferencesScreen;
