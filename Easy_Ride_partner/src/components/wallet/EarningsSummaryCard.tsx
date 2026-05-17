import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface EarningsSummaryCardProps {
  totalBalance: string;
  weeklyEarnings: string;
  withdrawableAmount: string;
  onWithdrawPress?: () => void;
}

export const EarningsSummaryCard = ({
  totalBalance,
  weeklyEarnings,
  withdrawableAmount,
  onWithdrawPress,
}: EarningsSummaryCardProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>TOTAL WALLET BALANCE</Text>
          <Text style={[styles.balanceText, { color: theme.colors.text }]}>{totalBalance}</Text>
        </View>
        <View style={[styles.walletIconContainer, { backgroundColor: theme.colors.primary + '15' }]}>
          <Ionicons name="wallet" size={24} color={theme.colors.primary} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.midRow}>
        <View style={styles.statCol}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>WEEKLY TOTAL</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{weeklyEarnings}</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>WITHDRAWABLE</Text>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>{withdrawableAmount}</Text>
        </View>
      </View>

      {onWithdrawPress && (
        <TouchableOpacity 
          style={[styles.withdrawBtn, { backgroundColor: theme.colors.primary }]}
          onPress={onWithdrawPress}
          activeOpacity={0.8}
        >
          <Ionicons name="cash-outline" size={18} color="#111111" style={{ marginRight: 6 }} />
          <Text style={styles.withdrawText}>EXPRESS CASHOUT NOW</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 18,
  },
  midRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  withdrawBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  withdrawText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.5,
  },
});
export default EarningsSummaryCard;
