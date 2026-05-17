import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

// Reusable Components
import { EarningsCard } from '../../../components/earnings/EarningsCard';
import { IncentiveCard } from '../../../components/earnings/IncentiveCard';
import { TripSummaryCard } from '../../../components/earnings/TripSummaryCard';
import { CalendarFilterModal } from '../../../components/earnings/CalendarFilterModal';

export const EarningsDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Dynamic Shift Weeks States
  const [modalVisible, setModalVisible] = useState(false);
  const [weekRange, setWeekRange] = useState('May 10 - May 16');
  const [totalEarnings, setTotalEarnings] = useState('₹18,420');
  const [todayEarnings, setTodayEarnings] = useState('₹4,850.75');
  const [tripsCount, setTripsCount] = useState(34);
  const [barHeights, setBarHeights] = useState({
    mon: '60%',
    tue: '80%',
    wed: '45%',
    thu: '95%',
    fri: '70%',
    sat: '100%',
    sun: '30%'
  });

  const handleCalendarPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleSelectRange = (
    type: 'current' | 'previous',
    label: string,
    earnings: string,
    today: string,
    trips: number,
    bars: { mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string }
  ) => {
    setWeekRange(label);
    setTotalEarnings(earnings);
    setTodayEarnings(today);
    setTripsCount(trips);
    setBarHeights(bars);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      {/* Screen Header */}
      <SafeAreaView style={[styles.header, { borderBottomColor: theme.colors.border }]} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            Earnings Dashboard
          </Text>
          <TouchableOpacity onPress={handleCalendarPress} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Core Earnings Summary */}
        <EarningsCard 
          todayEarnings={todayEarnings} 
          onlineHours="38h 15m" 
          tripsCount={tripsCount} 
          acceptanceRate="96%" 
        />

        {/* Dynamic Premium Analytics Graph Placeholder */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>WEEKLY OVERVIEW</Text>
        <View style={[styles.chartContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.semiBold }]}>{weekRange}</Text>
            <Text style={[styles.chartTotal, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>{totalEarnings}</Text>
          </View>

          {/* SVG Styled Bar Graph */}
          <View style={styles.chartVisual}>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: barHeights.mon as any, backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>M</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: barHeights.tue as any, backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>T</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: barHeights.wed as any, backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>W</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: barHeights.thu as any, backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>T</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: barHeights.fri as any, backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>F</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: barHeights.sat as any, backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>S</Text>
            </View>
            <View style={styles.barCol}>
              <View style={[styles.barFill, { height: barHeights.sun as any, backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>S</Text>
            </View>
          </View>
        </View>

        {/* Incentives Targets Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>ACTIVE INCENTIVES</Text>
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

      <CalendarFilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedRange={weekRange}
        onSelectRange={handleSelectRange}
      />
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
