import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface TransactionItemProps {
  title: string;
  date: string;
  amount: string;
  type: 'ride_earnings' | 'payout' | 'incentive' | 'referral';
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  date,
  amount,
  type,
}) => {
  const { theme } = useTheme();

  const getConfig = () => {
    switch (type) {
      case 'ride_earnings':
        return {
          icon: 'car',
          color: theme.colors.success,
          bg: 'rgba(76, 175, 80, 0.15)',
        };
      case 'payout':
        return {
          icon: 'download',
          color: theme.colors.danger,
          bg: 'rgba(229, 57, 53, 0.15)',
        };
      case 'incentive':
        return {
          icon: 'gift',
          color: theme.colors.primary,
          bg: 'rgba(245, 184, 0, 0.15)',
        };
      case 'referral':
      default:
        return {
          icon: 'people',
          color: theme.colors.text,
          bg: theme.colors.surface,
        };
    }
  };

  const config = getConfig();

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon as any} size={18} color={config.color} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{date}</Text>
      </View>
      <Text 
        style={[
          styles.amount, 
          { color: type === 'payout' ? theme.colors.danger : theme.colors.success }
        ]}
      >
        {amount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
  },
});
export default TransactionItem;
