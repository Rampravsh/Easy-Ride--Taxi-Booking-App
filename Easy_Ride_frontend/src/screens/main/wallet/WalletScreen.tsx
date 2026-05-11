import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

const TRANSACTIONS = [
  { id: '1', title: 'Walton', date: 'Today at 09:20 am', amount: '-$575.00', type: 'debit', icon: 'remove' },
  { id: '2', title: 'Nathsom', date: 'Today at 09:20 am', amount: '$575.00', type: 'credit', icon: 'checkmark' },
  { id: '3', title: 'Walton', date: 'Today at 09:20 am', amount: '-$575.00', type: 'debit', icon: 'remove' },
  { id: '4', title: 'Nathsom', date: 'Today at 09:20 am', amount: '$575.00', type: 'credit', icon: 'checkmark' },
  { id: '5', title: 'Nathsom', date: 'Today at 09:20 am', amount: '$575.00', type: 'credit', icon: 'checkmark' },
];

export const WalletScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const renderTransaction = ({ item }: { item: typeof TRANSACTIONS[0] }) => (
    <View style={[styles.transactionCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <View style={[styles.transactionIcon, { backgroundColor: item.type === 'debit' ? '#FFEDED' : '#E6F9F0' }]}>
        <Ionicons 
          name={item.icon as any} 
          size={16} 
          color={item.type === 'debit' ? theme.colors.danger : theme.colors.success} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: item.type === 'debit' ? theme.colors.text : theme.colors.text }]}>
        {item.amount}
      </Text>
    </View>
  );

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
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.primary + '33', marginRight: spacing.sm }]}>
            <Ionicons name="search" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.primary + '33' }]}>
            <Ionicons name="notifications" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topActions}>
           <View style={{ width: 44 }} />
           <TouchableOpacity 
             style={[styles.addMoneyButton, { borderColor: theme.colors.primary }]}
             onPress={() => navigation.navigate('AddAmount')}
           >
             <Text style={[styles.addMoneyText, { color: theme.colors.primary }]}>Add Money</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.balanceRow}>
          <View style={[styles.balanceCard, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary }]}>
             <Text style={[styles.balanceValue, { color: theme.colors.text }]}>$500</Text>
             <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Available Balance</Text>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary }]}>
             <Text style={[styles.balanceValue, { color: theme.colors.text }]}>$200</Text>
             <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Total Expend</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Transactions</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {TRANSACTIONS.map(item => (
          <View key={item.id}>
            {renderTransaction({ item })}
          </View>
        ))}
      </ScrollView>
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
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  addMoneyButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  addMoneyText: {
    fontSize: 16,
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
    fontSize: 24,
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
});
