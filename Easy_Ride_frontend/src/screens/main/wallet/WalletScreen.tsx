import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetWalletQuery, useGetWalletTransactionsQuery } from '../../../api/wallet.api';
import { useDispatch, useSelector } from 'react-redux';
import { setWallet } from '../../../redux/slices/walletSlice';
import { RootState } from '../../../redux/store';
import { paymentService } from '../../../services/payment.service';
import { Transaction } from '../../../types';

const { width } = Dimensions.get('window');

export const WalletScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const walletState = useSelector((state: RootState) => state.wallet);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch live wallet balance
  const { data: walletData, isLoading: walletLoading, refetch: refetchWallet } = useGetWalletQuery();

  // Fetch wallet transactions
  const { data: txData, isLoading: txLoading, refetch: refetchTransactions } = useGetWalletTransactionsQuery({ page: 1, limit: 30 });

  // Sync wallet state to Redux on fetch success
  useEffect(() => {
    if (walletData?.success && walletData.data) {
      dispatch(setWallet(walletData.data));
    }
  }, [walletData, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWallet(), refetchTransactions()]);
    setRefreshing(false);
  };

  const formatTxDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const transactions = txData?.data || [];
  
  const totalExpend = transactions
    .filter((tx) => tx.transactionType === 'debit')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalTopups = transactions
    .filter((tx) => tx.transactionType === 'credit')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isDebit = item.transactionType === 'debit';
    const amountFormatted = paymentService.formatCurrency(item.amount, item.currency || 'USD');
    
    let title = item.description || 'Wallet Transaction';
    let iconName = 'wallet-outline';
    let iconBg = 'rgba(255, 215, 0, 0.15)';

    if (item.transactionCategory === 'wallet_topup') {
      title = 'Funds Deposited';
      iconName = 'arrow-down-circle-outline';
      iconBg = '#E6F9F0';
    } else if (item.transactionCategory === 'ride_payment') {
      title = 'EasyRide Booking';
      iconName = 'car-outline';
      iconBg = 'rgba(255, 215, 0, 0.12)';
    } else if (item.transactionCategory === 'cancellation_refund') {
      title = 'Cancellation Refund';
      iconName = 'refresh-circle-outline';
      iconBg = '#E8F0FE';
    }

    return (
      <View style={[styles.transactionCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border + '15' }]}>
        <View style={[styles.transactionIcon, { backgroundColor: iconBg }]}>
          <Ionicons 
            name={iconName as any} 
            size={18} 
            color={isDebit ? theme.colors.danger : theme.colors.success} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>{formatTxDate(item.createdAt)}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isDebit ? theme.colors.text : theme.colors.success }]}>
          {isDebit ? '-' : '+'}{amountFormatted}
        </Text>
      </View>
    );
  };

  const renderHeaderComponents = () => {
    const balanceFormatted = paymentService.formatCurrency(walletState.balance, walletState.currency);
    const expendFormatted = paymentService.formatCurrency(totalExpend, walletState.currency);

    return (
      <View style={{ marginBottom: spacing.md }}>
        {/* Premium Stylized Virtual Credit Card */}
        <View style={[styles.creditCard, { backgroundColor: '#000000' }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.chipContainer}>
              <Ionicons name="hardware-chip-sharp" size={28} color="#FFD700" />
              <Text style={styles.chipText}>EASYRIDE PAY</Text>
            </View>
            <Ionicons name="logo-bitcoin" size={24} color="#FFD700" />
          </View>

          <Text style={styles.cardBalanceLabel}>CURRENT METROPOLITAN BALANCE</Text>
          <Text style={styles.cardBalanceValue}>{balanceFormatted}</Text>

          <View style={styles.cardFooterRow}>
            <View>
              <Text style={styles.cardHolderLabel}>ACCOUNT STATUS</Text>
              <Text style={styles.cardHolderValue}>SECURE & VERIFIED</Text>
            </View>
            <View style={styles.premiumNfcBadge}>
              <Ionicons name="wifi-outline" size={16} color="#FFF" style={styles.nfcRotate} />
            </View>
          </View>
        </View>

        {/* Quick Actions / Metrics Pills */}
        <View style={styles.balanceRow}>
          <View style={[styles.balanceCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border + '15' }]}>
             <Ionicons name="arrow-up-outline" size={20} color={theme.colors.success} style={{ marginBottom: 4 }} />
             <Text style={[styles.balanceValue, { color: theme.colors.text }]}>
               {paymentService.formatCurrency(totalTopups, walletState.currency)}
             </Text>
             <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Deposits</Text>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border + '15' }]}>
             <Ionicons name="arrow-down-outline" size={20} color={theme.colors.danger} style={{ marginBottom: 4 }} />
             <Text style={[styles.balanceValue, { color: theme.colors.text }]}>{expendFormatted}</Text>
             <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Expenditure</Text>
          </View>
        </View>

        {/* Shortcut Quick Deposit Triggers */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: spacing.md }]}>Quick Top-up</Text>
        <View style={styles.shortcutRow}>
          {[25, 50, 100, 250].map((amt) => (
            <TouchableOpacity 
              key={amt} 
              style={[styles.shortcutBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('AddAmount')}
            >
              <Text style={styles.shortcutText}>+${amt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Statement Transactions</Text>
          {transactions.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const isScreenLoading = walletLoading && txLoading && !refreshing;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Immersive Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Digital Wallet</Text>
        <TouchableOpacity 
          style={[styles.addMoneyButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('AddAmount')}
        >
          <Ionicons name="add" size={16} color="#000" style={{ marginRight: 2 }} />
          <Text style={styles.addMoneyText}>Deposit</Text>
        </TouchableOpacity>
      </View>

      {isScreenLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Syncing ledger transactions...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={renderTransaction}
          ListHeaderComponent={renderHeaderComponents}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="wallet-outline" size={56} color={theme.colors.border} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Transactions Recorded</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Add money to your EasyRide balance to pay for premium travels seamlessly.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: 40,
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addMoneyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
  },
  creditCard: {
    borderRadius: 24,
    padding: spacing.xl,
    height: 200,
    width: '100%',
    marginBottom: spacing.lg,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  cardBalanceLabel: {
    color: '#9CA3AF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: spacing.md,
  },
  cardBalanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolderLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  cardHolderValue: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  premiumNfcBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcRotate: {
    transform: [{ rotate: '90deg' }],
  },
  balanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  balanceCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  balanceLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  shortcutBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 1.5,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
