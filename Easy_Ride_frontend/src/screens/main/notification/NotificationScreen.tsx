import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SectionList, 
  TouchableOpacity, 
  RefreshControl, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { 
  useGetNotificationsQuery, 
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation 
} from '../../../api/notification.api';
import { Notification } from '../../../types/notification';

interface NotificationSection {
  title: string;
  data: Notification[];
}

export const NotificationScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // RTK Queries & Mutations
  const { data: response, isLoading, isFetching, refetch } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = response?.data || [];

  // Group notifications dynamically by date ("Today", "Yesterday", or Month Day, Year)
  const groupNotificationsByDate = (items: Notification[]): NotificationSection[] => {
    const groups: { [key: string]: Notification[] } = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    items.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      let dateString = itemDate.toDateString();

      if (dateString === today) {
        dateString = 'Today';
      } else if (dateString === yesterday) {
        dateString = 'Yesterday';
      } else {
        // Format older dates beautifully: e.g. "May 27, 2026"
        dateString = itemDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }

      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      groups[dateString].push(item);
    });

    return Object.keys(groups).map((key) => ({
      title: key,
      data: groups[key],
    }));
  };

  const sections = groupNotificationsByDate(notifications);

  // Map backend notification category codes to Vector Icon glyphs
  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_update':
      case 'refund_update':
        return 'card-outline';
      case 'ride_update':
        return 'car-outline';
      case 'chat_message':
        return 'chatbubble-ellipses-outline';
      case 'call_notification':
        return 'call-outline';
      case 'promo':
        return 'pricetag-outline';
      case 'reminder':
      case 'schedule_reminder':
        return 'time-outline';
      case 'system_alert':
      case 'fraud_alert':
        return 'warning-outline';
      default:
        return 'notifications-outline';
    }
  };

  // Mark notification read on press
  const handleItemPress = async (item: Notification) => {
    if (!item.isRead) {
      try {
        await markRead(item._id).unwrap();
      } catch (err) {
        console.error('[NotificationScreen] Mark read failed:', err);
      }
    }

    // Proactive handling of deep links on specific notification categories
    if (item.metadata?.rideId) {
      // If notification has ride tracking link, navigate there (placeholder)
      console.log(`[Notification] Deep link to ride tracking: ${item.metadata.rideId}`);
    }
  };

  // Mark all unread notifications read
  const handleMarkAllRead = async () => {
    const unreadExist = notifications.some((n) => !n.isRead);
    if (!unreadExist) {
      Alert.alert('Info', 'All notifications are already marked as read.');
      return;
    }

    try {
      await markAllRead().unwrap();
      Alert.alert('Success', 'All notifications marked as read successfully!');
    } catch (err) {
      console.error('[NotificationScreen] Mark all read failed:', err);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: item.isRead ? theme.colors.card : (isDark ? theme.colors.primary + '10' : theme.colors.primary + '0A'), 
          borderColor: item.isRead ? theme.colors.border : theme.colors.primary + '40'
        }
      ]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      {/* Dynamic Glyphs */}
      <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.colors.background : '#F5F5F5' }]}>
        <Ionicons name={getIcon(item.notificationType) as any} size={22} color={theme.colors.primary} />
      </View>

      {/* Description Content */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.text, fontWeight: item.isRead ? '600' : '800' }]}>
          {item.title}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {item.body}
        </Text>
      </View>

      {/* Unread indicators dot */}
      {!item.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Custom AuthHeader with absolute alignment */}
      <View style={styles.headerContainer}>
        <AuthHeader title="Notifications" onBack={() => navigation.goBack()} />
        {notifications.length > 0 && (
          <TouchableOpacity 
            style={[styles.markAllButton, { borderColor: theme.colors.primary }]}
            onPress={handleMarkAllRead}
            disabled={isMarkingAll}
          >
            {isMarkingAll ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={[styles.markAllText, { color: theme.colors.primary }]}>Mark all read</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={80} color={theme.colors.border} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>All caught up!</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            You will see push notifications, ride alerts, and payment receipts here.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>{title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isFetching} 
              onRefresh={refetch} 
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
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
  headerContainer: {
    position: 'relative',
    zIndex: 10,
  },
  markAllButton: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.sm,
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
