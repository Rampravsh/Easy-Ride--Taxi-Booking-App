import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Reusable Core Components
import { EarningsSummaryCard } from '../../../components/wallet/EarningsSummaryCard';
import { WithdrawalStatusCard } from '../../../components/wallet/WithdrawalStatusCard';
import { TransactionHistoryCard } from '../../../components/wallet/TransactionHistoryCard';
import { IncentiveCard } from '../../../components/earnings/IncentiveCard';

const mockTransactions = [
  { id: '1', type: 'ride' as const, title: 'Trip payment ER-98520', amount: '₹340.00', date: 'Yesterday • 05:18 PM' },
  { id: '2', type: 'bonus' as const, title: 'Milestone Rush Hour Bonus', amount: '₹200.00', date: '14 May • 10:12 PM' },
  { id: '3', type: 'payout' as const, title: 'Express Payout to HDFC Bank', amount: '₹1,500.00', date: '12 May • 11:30 AM' },
  { id: '4', type: 'ride' as const, title: 'Trip payment ER-98412', amount: '₹520.00', date: '11 May • 02:40 PM' },
];

export const WalletScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [cashoutStatus, setCashoutStatus] = useState<'idle' | 'processing' | 'done'>('idle');

  const handleCashout = () => {
    setCashoutStatus('processing');
    setTimeout(() => {
      setCashoutStatus('done');
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />

      {/* Screen Header */}
      <SafeAreaView style={[styles.header, { borderBottomColor: theme.colors.border }]} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Digital Wallet</Text>
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main balance card aggregates */}
        <EarningsSummaryCard 
          totalBalance="₹2,480.00" 
          weeklyEarnings="₹8,920.00" 
          withdrawableAmount="₹2,480.00" 
          onWithdrawPress={cashoutStatus === 'idle' ? handleCashout : undefined} 
        />

        {/* Dynamic cashout simulator dialog feedback */}
        {cashoutStatus === 'processing' && (
          <View style={[styles.feedbackPill, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
            <Ionicons name="sync" size={14} color={theme.colors.primary} style={styles.spinIcon} />
            <Text style={[styles.feedbackText, { color: theme.colors.text }]}>Initiating express secure cashout to bank...</Text>
          </View>
        )}

        {cashoutStatus === 'done' && (
          <View style={{ marginTop: 16 }}>
            <WithdrawalStatusCard 
              payoutId="TXN-98412-SEC" 
              amount="₹2,480.00" 
              status="completed" 
              date="Just now" 
            />
          </View>
        )}

        {/* Incentives Milestones target progress */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>ACTIVE PROMOTION BONUS</Text>
        <IncentiveCard 
          title="Daily Complete Streak" 
          description="Complete 20 rides in Bengaluru within 24 hours to claim your bonus." 
          bonusAmount="₹300" 
          progressText="18 / 20 rides completed" 
          progressPercent={0.9} 
        />

        {/* Ledger Transaction History listing card */}
        <View style={{ marginTop: 8 }}>
          <TransactionHistoryCard transactions={mockTransactions} />
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 12,
  },
  feedbackPill: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  spinIcon: {
    marginRight: 4,
  },
});
export default WalletScreen;
