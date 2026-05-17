import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface PayoutCardProps {
  bankName: string;
  accountNumber: string;
  payoutSchedule: string;
}

export const PayoutCard: React.FC<PayoutCardProps> = ({
  bankName,
  accountNumber,
  payoutSchedule,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="business" size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.details}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Bank Account Details</Text>
          <Text style={[styles.bank, { color: theme.colors.textSecondary }]}>
            {bankName} •••• {accountNumber}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.scheduleRow}>
        <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
        <Text style={[styles.scheduleText, { color: theme.colors.textSecondary }]}>
          Payout Schedule: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{payoutSchedule}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  bank: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
export default PayoutCard;
