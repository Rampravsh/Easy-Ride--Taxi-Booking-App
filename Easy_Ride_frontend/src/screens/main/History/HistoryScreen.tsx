import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

type HistoryType = 'Upcoming' | 'Completed' | 'Cancelled';

const HISTORY_DATA: Record<HistoryType, any[]> = {
  Upcoming: [
    { id: '1', name: 'Nate', car: 'Mustang Shelby GT', time: 'Today at 09:20 am' },
    { id: '2', name: 'Henry', car: 'Mustang Shelby GT', time: 'Today at 10:20 am' },
    { id: '3', name: 'William', car: 'Mustang Shelby GT', time: 'Tomorrow at 09:20 am' },
    { id: '4', name: 'Nate', car: 'Mustang Shelby GT', time: 'Today at 09:20 am' },
    { id: '5', name: 'Henry', car: 'Mustang Shelby GT', time: 'Today at 10:20 am' },
    { id: '6', name: 'William', car: 'Mustang Shelby GT', time: 'Tomorrow at 09:20 am' },
    { id: '7', name: 'Henry', car: 'Mustang Shelby GT', time: 'Today at 10:20 am' },
    { id: '8', name: 'William', car: 'Mustang Shelby GT', time: 'Tomorrow at 09:20 am' },
  ],
  Completed: [
    { id: '1', name: 'Nate', car: 'Mustang Shelby GT', status: 'Done' },
    { id: '2', name: 'Henry', car: 'Mustang Shelby GT', status: 'Done' },
    { id: '3', name: 'William', car: 'Mustang Shelby GT', status: 'Done' },
    { id: '4', name: 'Nate', car: 'Mustang Shelby GT', status: 'Done' },
    { id: '5', name: 'Henry', car: 'Mustang Shelby GT', status: 'Done' },
    { id: '6', name: 'William', car: 'Mustang Shelby GT', status: 'Done' },
    { id: '7', name: 'Henry', car: 'Mustang Shelby GT', status: 'Done' },
    { id: '8', name: 'William', car: 'Mustang Shelby GT', status: 'Done' },
  ],
  Cancelled: [
    { id: '1', name: 'Nate', car: 'Mustang Shelby GT', status: 'Cancel' },
    { id: '2', name: 'Henry', car: 'Mustang Shelby GT', status: 'Cancel' },
    { id: '3', name: 'William', car: 'Mustang Shelby GT', status: 'Cancel' },
    { id: '4', name: 'Nate', car: 'Mustang Shelby GT', status: 'Cancel' },
    { id: '5', name: 'Henry', car: 'Mustang Shelby GT', status: 'Cancel' },
    { id: '6', name: 'William', car: 'Mustang Shelby GT', status: 'Cancel' },
    { id: '7', name: 'Henry', car: 'Mustang Shelby GT', status: 'Cancel' },
    { id: '8', name: 'William', car: 'Mustang Shelby GT', status: 'Cancel' },
  ],
};

export const HistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [activeTab, setActiveTab] = useState<HistoryType>('Upcoming');

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.primary + '33' }]}>
      <View style={styles.cardMain}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.car, { color: theme.colors.textSecondary }]}>{item.car}</Text>
      </View>
      <View style={styles.cardStatus}>
        {activeTab === 'Upcoming' ? (
          <Text style={[styles.time, { color: theme.colors.text }]}>{item.time}</Text>
        ) : (
          <Text style={[
            styles.status, 
            { color: activeTab === 'Completed' ? theme.colors.success : theme.colors.danger }
          ]}>
            {item.status}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>History</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
        {(['Upcoming', 'Completed', 'Cancelled'] as HistoryType[]).map((tab) => (
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

      <FlatList
        data={HISTORY_DATA[activeTab]}
        renderItem={renderItem}
        keyExtractor={item => `${activeTab}-${item.id}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
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
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  cardMain: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  car: {
    fontSize: 12,
  },
  cardStatus: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
});
