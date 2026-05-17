import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface Transaction {
  id: string;
  type: 'ride' | 'payout' | 'bonus';
  title: string;
  amount: string;
  date: string;
}

interface TransactionHistoryCardProps {
  transactions: Transaction[];
}

export const TransactionHistoryCard = ({
  transactions,
}: TransactionHistoryCardProps) => {
  const { theme } = useTheme();

  const getIconConfig = (type: 'ride' | 'payout' | 'bonus') => {
    switch (type) {
      case 'ride':
        return { name: 'car-outline', color: theme.colors.success, bg: theme.colors.success + '15' };
      case 'payout':
        return { name: 'cash-outline', color: '#6366F1', bg: '#6366F115' };
      case 'bonus':
        return { name: 'gift-outline', color: theme.colors.primary, bg: theme.colors.primary + '15' };
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Transaction History</Text>

      {transactions.map((tx, index) => {
        const config = getIconConfig(tx.type);
        const isExpense = tx.type === 'payout';

        return (
          <View key={tx.id}>
            <View style={styles.row}>
              <View style={styles.left}>
                <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
                  <Ionicons name={config.name as any} size={18} color={config.color} />
                </View>
                <View>
                  <Text style={[styles.titleText, { color: theme.colors.text }]} numberOfLines={1}>
                    {tx.title}
                  </Text>
                  <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>{tx.date}</Text>
                </View>
              </View>

              <Text style={[
                styles.amountText,
                { color: isExpense ? theme.colors.danger : theme.colors.success }
              ]}>
                {isExpense ? '-' : '+'}{tx.amount}
              </Text>
            </View>

            {index < transactions.length - 1 && (
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            )}
          </View>
        );
      })}
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
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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
    paddingVertical: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
});
export default TransactionHistoryCard;
