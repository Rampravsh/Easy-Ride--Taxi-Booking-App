import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface WithdrawalStatusCardProps {
  payoutId: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export const WithdrawalStatusCard = ({
  payoutId,
  amount,
  status,
  date,
}: WithdrawalStatusCardProps) => {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'pending': return theme.colors.primary;
      case 'failed': return theme.colors.danger;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed': return 'TRANSFERRED SUCCESS';
      case 'pending': return 'PROCESSING PAYOUT';
      case 'failed': return 'TRANSFER REJECTED';
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.row}>
        <View>
          <Text style={[styles.payoutIdText, { color: theme.colors.textSecondary }]}>PAYOUT REF ID: {payoutId}</Text>
          <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>{date}</Text>
        </View>
        <Text style={[styles.amountText, { color: theme.colors.text }]}>{amount}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutIdText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
export default WithdrawalStatusCard;
