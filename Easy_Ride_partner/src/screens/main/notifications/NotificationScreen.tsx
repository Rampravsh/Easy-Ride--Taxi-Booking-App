import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme';
import { NotificationCard, NotificationItem } from '../../../components/notifications/NotificationCard';
import { NotificationFilterTabs } from '../../../components/notifications/NotificationFilterTabs';
import { AlertBanner } from '../../../components/notifications/AlertBanner';
import { RealtimeAlertChip } from '../../../components/notifications/RealtimeAlertChip';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'ride', label: 'Rides' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'fraud', label: 'Compliance' },
  { key: 'support', label: 'Support' },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Weekly Incentive Accomplished!',
    body: 'Outstanding work! You completed 25 rides and unlocked an extra ₹1,500 bonus. Credited directly to your wallet.',
    timestamp: '2 hours ago',
    category: 'earnings',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Suspicious GPS Activity Detected',
    body: 'We detected inconsistent navigation patterns during your last ride. Please ensure you follow designated route options to prevent payout holds.',
    timestamp: '4 hours ago',
    category: 'fraud',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Support Ticket #8292 Resolved',
    body: 'Your fare dispute request for ride ID ER-9828 has been resolved. A manual adjustment of ₹120 was added.',
    timestamp: '1 day ago',
    category: 'support',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Rider App Integrity Update',
    body: 'Version 2.4.0 is now live. Includes optimized high-fidelity maps, real-time audio safety logger, and battery improvements.',
    timestamp: '2 days ago',
    category: 'general',
    unread: false,
  },
  {
    id: 'n5',
    title: 'New Airport Queue Priority Active',
    body: 'Terminal 2 congestion charge priority is now live. Earn 1.5x surge multipliers when waiting at Airport Parking Area A.',
    timestamp: '3 days ago',
    category: 'ride',
    unread: false,
  },
];

export const NotificationScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showWarningBanner, setShowWarningBanner] = useState(true);

  const handleSelectTab = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const handlePressCard = (item: NotificationItem) => {
    // Mark specific card as read on click
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === item.id ? { ...notif, unread: false } : notif))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (selectedTab === 'all') return true;
    return item.category === selectedTab;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            Inbox
          </Text>
        </View>
        
        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
          <Text style={[styles.markReadText, { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Connectivity Alert chip and quick filters */}
      <View style={styles.subHeader}>
        <RealtimeAlertChip status="connected" label="Operational Sync Online" />
      </View>

      {/* Critical Warnings */}
      {showWarningBanner && (
        <AlertBanner
          type="danger"
          title="Documents Expiring Soon!"
          message="Your Vehicle Insurance expires in 4 days. Upload a renewed document under Profile > Documents to maintain dispatch eligibility."
          onDismiss={() => setShowWarningBanner(false)}
        />
      )}

      {/* Filter Tabs */}
      <NotificationFilterTabs
        selectedTab={selectedTab}
        onSelectTab={handleSelectTab}
        tabs={FILTER_TABS}
      />

      {/* List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard item={item} onPress={handlePressCard} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.medium }]}>
              No notifications here
            </Text>
          </View>
        }
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 20,
  },
  markReadText: {
    fontSize: 13,
  },
  subHeader: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
  },
});
export default NotificationScreen;
