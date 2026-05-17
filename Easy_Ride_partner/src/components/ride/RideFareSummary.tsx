import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RideFareSummaryProps {
  baseFare: string;
  surgeBonus?: string;
  tollFares?: string;
  totalEarnings: string;
  paymentMode: 'CASH' | 'ONLINE' | 'WALLET';
}

export const RideFareSummary = ({
  baseFare,
  surgeBonus,
  tollFares,
  totalEarnings,
  paymentMode,
}: RideFareSummaryProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Earnings Breakdown</Text>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Trip Base Fare</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{baseFare}</Text>
      </View>

      {surgeBonus && (
        <View style={styles.row}>
          <View style={styles.labelWithIcon}>
            <Ionicons name="flash" size={12} color={theme.colors.primary} style={{ marginRight: 4 }} />
            <Text style={[styles.label, { color: theme.colors.primary, fontWeight: '700' }]}>Surge Multiplier Bonus</Text>
          </View>
          <Text style={[styles.value, { color: theme.colors.primary, fontWeight: '700' }]}>+{surgeBonus}</Text>
        </View>
      )}

      {tollFares && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Tolls & Airport Fees</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{tollFares}</Text>
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.row}>
        <Text style={[styles.totalLabel, { color: theme.colors.text }]}>YOUR NET EARNINGS</Text>
        <Text style={[styles.totalValue, { color: theme.colors.primary }]}>{totalEarnings}</Text>
      </View>

      <View style={[styles.paymentBadge, { backgroundColor: theme.colors.surface }]}>
        <Ionicons 
          name={paymentMode === 'CASH' ? 'cash-outline' : paymentMode === 'ONLINE' ? 'card-outline' : 'wallet-outline'} 
          size={16} 
          color={theme.colors.textSecondary} 
        />
        <Text style={[styles.paymentText, { color: theme.colors.textSecondary }]}>
          PAID VIA {paymentMode}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 18,
  },
  paymentText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 6,
  },
});
export default RideFareSummary;
