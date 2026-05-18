import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetWalletQuery, useGetWalletTransactionsQuery } from '../../../api/wallet.api';
import { useDispatch, useSelector } from 'react-redux';
import { setWallet } from '../../../redux/slices/walletSlice';
import { RootState } from '../../../redux/store';
import { paymentService } from '../../../services/payment.service';
import { Transaction } from '../../../types';

export const WalletScreen = () => {
  const { theme } = useTheme();
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
      return date.toLocaleDateString('en-IN', {
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

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isDebit = item.transactionType === 'debit';
    const amountFormatted = paymentService.formatCurrency(item.amount, item.currency || 'INR');
    
    // Determine title / category
    let title = item.description || 'Wallet Transaction';
    if (item.transactionCategory === 'wallet_topup') {
      title = 'Wallet Topup';
    } else if (item.transactionCategory === 'ride_payment') {
      title = 'Ride Payment';
    } else if (item.transactionCategory === 'cancellation_refund') {
      title = 'Cancellation Refund';
    }

    return (
      <View style={[styles.transactionCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <View style={[styles.transactionIcon, { backgroundColor: isDebit ? '#FFEDED' : '#E6F9F0' }]}>
          <Ionicons 
            name={isDebit ? 'remove' : 'checkmark'} 
            size={16} 
            color={isDebit ? theme.colors.danger : theme.colors.success} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>{formatTxDate(item.createdAt)}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isDebit ? theme.colors.danger : theme.colors.success }]}>
          {isDebit ? '-' : '+'}{amountFormatted}
        </Text>
      </View>
    );
  };

  const renderHeaderComponents = () => {
    const balanceFormatted = paymentService.formatCurrency(walletState.balance, walletState.currency);
    const expendFormatted = paymentService.formatCurrency(totalExpend, walletState.currency);

    return (
      <View>
        {/* Balance & Expend Information */}
        <View style={styles.balanceRow}>
          <View style={[styles.balanceCard, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary }]}>
             <Text style={[styles.balanceValue, { color: theme.colors.text }]}>{balanceFormatted}</Text>
             <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Available Balance</Text>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary }]}>
             <Text style={[styles.balanceValue, { color: theme.colors.text }]}>{expendFormatted}</Text>
             <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Total Expend</Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Transactions</Text>
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.colors.primary + '33' }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Wallet</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.addMoneyButton, { borderColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('AddAmount')}
          >
            <Text style={[styles.addMoneyText, { color: theme.colors.primary }]}>Add Money</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isScreenLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading Wallet Details...</Text>
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
              <Ionicons name="wallet-outline" size={60} color={theme.colors.border} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No transactions yet</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Add money to top up your wallet balance and ride instantly.
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  addMoneyButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  addMoneyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  balanceCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
