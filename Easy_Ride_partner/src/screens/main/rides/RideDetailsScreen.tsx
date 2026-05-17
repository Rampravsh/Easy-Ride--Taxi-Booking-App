import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Reusable Components
import { RideTimeline } from '../../../components/ride/RideTimeline';
import { RideFareSummary } from '../../../components/ride/RideFareSummary';

export const RideDetailsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      {/* Navigation Header */}
      <SafeAreaView style={[styles.header, { borderBottomColor: theme.colors.border }]} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Trip History Details</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Metadata Details Bar */}
        <View style={[styles.metaCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>TRIP REFERENCE ID</Text>
            <Text style={[styles.metaValue, { color: theme.colors.text }]}>ER-98520-BGR</Text>
          </View>
          <View style={[styles.innerDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.metaRow}>
            <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>DATE & TIME</Text>
            <Text style={[styles.metaValue, { color: theme.colors.text }]}>15 May 2026, 04:30 PM</Text>
          </View>
        </View>

        {/* Pickup & Destination Timeline Checkpoints */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>ROUTE SUMMARY</Text>
        <RideTimeline 
          steps={[
            {
              title: 'Pickup Location',
              subtitle: 'Vasanth Nagar, Bengaluru, Karnataka',
              time: '04:35 PM',
              completed: true,
              active: false,
            },
            {
              title: 'Destination Drop Point',
              subtitle: 'HSR Layout Sector 2, Bengaluru, Karnataka',
              time: '05:18 PM',
              completed: true,
              active: false,
            }
          ]}
        />

        {/* Fare Invoicing Details */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>BILLING DETAILS</Text>
        <RideFareSummary 
          baseFare="₹220.00" 
          surgeBonus="₹80.00" 
          tollFares="₹40.00" 
          totalEarnings="₹340.00" 
          paymentMode="WALLET" 
        />

        {/* Ride Custom Notes */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>RIDE CUSTOMER MEMORANDUM</Text>
        <View style={[styles.notesCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="chatbox-ellipses-outline" size={18} color={theme.colors.primary} style={{ marginRight: 10 }} />
          <Text style={[styles.notesText, { color: theme.colors.textSecondary }]}>
            "Please call when outside the main gate. The security guard requires gate pass validation."
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  metaCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  innerDivider: {
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 22,
    marginBottom: 10,
  },
  notesCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
export default RideDetailsScreen;
