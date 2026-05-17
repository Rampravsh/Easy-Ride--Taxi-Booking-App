import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface TripSummaryCardProps {
  time: string;
  pickup: string;
  drop: string;
  amount: string;
  paymentMode: 'CASH' | 'WALLET' | 'ONLINE';
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({
  time,
  pickup,
  drop,
  amount,
  paymentMode,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>{time}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={[styles.amount, { color: theme.colors.text }]}>{amount}</Text>
          <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>{paymentMode}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.route}>
        <View style={styles.indicators}>
          <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
          <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.square, { backgroundColor: theme.colors.primary }]} />
        </View>
        <View style={styles.addresses}>
          <Text style={[styles.addressText, { color: theme.colors.text }]} numberOfLines={1}>
            {pickup}
          </Text>
          <View style={{ height: 12 }} />
          <Text style={[styles.addressText, { color: theme.colors.text }]} numberOfLines={1}>
            {drop}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  route: {
    flexDirection: 'row',
  },
  indicators: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 1.5,
    flex: 1,
    marginVertical: 3,
  },
  square: {
    width: 8,
    height: 8,
  },
  addresses: {
    flex: 1,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
export default TripSummaryCard;
