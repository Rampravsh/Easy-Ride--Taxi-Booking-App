import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useGetMyTransactionsQuery } from '../../../api/transaction.api';
import { paymentService } from '../../../services/payment.service';
import { Transaction } from '../../../types';

type HistoryType = 'Upcoming' | 'Completed' | 'Cancelled';

export const HistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [activeTab, setActiveTab] = useState<HistoryType>('Completed');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real past transactions linked to rides and top-ups from the backend
  const { data: txData, isLoading, refetch } = useGetMyTransactionsQuery({ page: 1, limit: 50 });

  const transactions = txData?.data || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getFilteredData = () => {
    if (activeTab === 'Upcoming') {
      return []; // Upcoming schedules fallback
    }

    if (activeTab === 'Completed') {
      // Filter transactions related to completed ride payments
      return transactions.filter(tx => tx.transactionCategory === 'ride_payment');
    }

    if (activeTab === 'Cancelled') {
      // Filter transactions related to cancellation refunds
      return transactions.filter(tx => tx.transactionCategory === 'cancellation_refund');
    }

    return [];
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

  const renderItem = ({ item }: { item: Transaction }) => {
    const amountFormatted = paymentService.formatCurrency(item.amount, item.currency || 'INR');
    
    let displayName = 'Completed Ride';
    let subtitle = item.description || 'Easy Ride Trip Settle';
    let statusText = 'Done';
    let iconName: any = 'car-sport-outline';

    if (activeTab === 'Cancelled') {
      displayName = 'Cancelled Ride';
      subtitle = item.description || 'Trip Cancellation Settle';
      statusText = 'Refunded';
      iconName = 'close-circle-outline';
    }

    return (
      <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <View style={[styles.iconContainer, { backgroundColor: activeTab === 'Cancelled' ? '#FFEDED' : '#E6F9F0' }]}>
          <Ionicons 
            name={iconName} 
            size={22} 
            color={activeTab === 'Cancelled' ? theme.colors.danger : theme.colors.success} 
          />
        </View>
        <View style={styles.cardMain}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{displayName}</Text>
          <Text style={[styles.car, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>{formatTxDate(item.createdAt)}</Text>
        </View>
        <View style={styles.cardStatus}>
          <Text style={[styles.amountText, { color: theme.colors.text }]}>{amountFormatted}</Text>
          <Text style={[
            styles.status, 
            { color: activeTab === 'Completed' ? theme.colors.success : theme.colors.textSecondary }
          ]}>
            {statusText}
          </Text>
        </View>
      </View>
    );
  };

  const filteredList = getFilteredData();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Ride History</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {(['Completed', 'Cancelled', 'Upcoming'] as HistoryType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? '#FFFFFF' : theme.colors.textSecondary }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading history...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          renderItem={renderItem}
          keyExtractor={item => `${activeTab}-${item._id}`}
          contentContainerStyle={styles.list}
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
              <Ionicons 
                name={activeTab === 'Upcoming' ? 'calendar-outline' : activeTab === 'Cancelled' ? 'close-circle-outline' : 'car-outline'} 
                size={60} 
                color={theme.colors.border} 
              />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No rides found</Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {activeTab === 'Upcoming' 
                  ? "You don't have any upcoming trips scheduled." 
                  : `You don't have any ${activeTab.toLowerCase()} ride records.`}
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardMain: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  car: {
    fontSize: 12,
    lineHeight: 16,
  },
  date: {
    fontSize: 10,
    marginTop: 2,
  },
  cardStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
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
