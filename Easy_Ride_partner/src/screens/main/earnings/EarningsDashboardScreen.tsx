import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Reusable Components
import { EarningsCard } from '../../../components/earnings/EarningsCard';
import { IncentiveCard } from '../../../components/earnings/IncentiveCard';
import { TripSummaryCard } from '../../../components/earnings/TripSummaryCard';

export const EarningsDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />

      {/* Screen Header */}
      <SafeAreaView style={[styles.header, { borderBottomColor: theme.colors.border }]} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Earnings Dashboard</Text>
          <TouchableOpacity>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Core Earnings Summary */}
        <EarningsCard 
          todayEarnings="₹4,850.75" 
          onlineHours="38h 15m" 
          tripsCount={34} 
          acceptanceRate="96%" 
        />

        {/* Dynamic Premium Analytics Graph Placeholder */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>WEEKLY OVERVIEW</Text>
        <View style={[styles.chartContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: theme.colors.textSecondary }]}>May 10 - May 16</Text>
            <Text style={[styles.chartTotal, { color: theme.colors.text }]}>₹18,420</Text>
          </View>

          {/* SVG Styled Bar Graph */}
          <View style={styles.chartVisual}>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: '60%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>M</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: '80%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>T</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: '45%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>W</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: '95%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>T</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: '70%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>F</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: '100%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>S</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: '30%', backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>S</Text>
            </View>
          </View>
        </View>

        {/* Incentives Targets Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>ACTIVE INCENTIVES</Text>
        <IncentiveCard 
          title="Weekend Rush Hour Bonus" 
          description="Complete 10 rides between 5 PM and 9 PM on Saturday/Sunday." 
          bonusAmount="₹500" 
          progressText="6 / 10 rides completed" 
          progressPercent={0.6} 
        />
        <IncentiveCard 
          title="Daily Milestone Bonus" 
          description="Earn an extra bonus of ₹200 by completing 15 rides today." 
          bonusAmount="₹200" 
          progressText="12 / 15 rides completed" 
          progressPercent={0.8} 
        />

        {/* Trip Summary Logs List */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>RECENT COMPLETED TRIPS</Text>
        <TripSummaryCard 
          time="04:30 PM • 14 May" 
          pickup="Vasanth Nagar, Bengaluru" 
          drop="HSR Layout Sector 2, Bengaluru" 
          amount="₹340.00" 
          paymentMode="ONLINE" 
        />
        <TripSummaryCard 
          time="01:15 PM • 14 May" 
          pickup="Koramangala 4th Block, Bengaluru" 
          drop="MG Road Metro Station, Bengaluru" 
          amount="₹180.00" 
          paymentMode="CASH" 
        />
        <TripSummaryCard 
          time="11:00 AM • 14 May" 
          pickup="Whitefield Main Road, Bengaluru" 
          drop="Electronic City Phase 1, Bengaluru" 
          amount="₹520.00" 
          paymentMode="WALLET" 
        />
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 12,
  },
  chartContainer: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartTotal: {
    fontSize: 20,
    fontWeight: '900',
  },
  chartVisual: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    width: '10%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
  },
});
export default EarningsDashboardScreen;
