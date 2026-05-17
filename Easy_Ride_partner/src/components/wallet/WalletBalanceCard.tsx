import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface WalletBalanceCardProps {
  balance: string;
  onPressCashout: () => void;
  isLoading?: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  onPressCashout,
  isLoading = false,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.top}>
        <View>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CURRENT BALANCE</Text>
          <Text style={[styles.amount, { color: theme.colors.text }]}>{balance}</Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
          <Ionicons name="wallet" size={24} color={theme.colors.success} />
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.cashoutBtn, { backgroundColor: theme.colors.primary }]}
        onPress={onPressCashout}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.cashoutText}>{isLoading ? 'Processing...' : 'Express Cashout'}</Text>
        <Ionicons name="flash" size={16} color="#111111" style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    width: '100%',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: '900',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashoutBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
});
export default WalletBalanceCard;
