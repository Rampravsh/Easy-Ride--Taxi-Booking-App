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
import { useTheme, spacing, radius, typography } from '../../../theme';
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
        dateString = 'TODAY';
      } else if (dateString === yesterday) {
        dateString = 'YESTERDAY';
      } else {
        dateString = itemDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase();
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

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'payment_update':
      case 'refund_update':
        return { name: 'card', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
      case 'ride_update':
        return { name: 'car-sport', color: theme.colors.primary, bg: 'rgba(255, 215, 0, 0.15)' };
      case 'chat_message':
        return { name: 'chatbubbles', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' };
      case 'call_notification':
        return { name: 'call', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' };
      case 'promo':
        return { name: 'gift', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)' };
      case 'reminder':
      case 'schedule_reminder':
        return { name: 'alarm', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
      case 'system_alert':
      case 'fraud_alert':
        return { name: 'shield-alert', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' };
      default:
        return { name: 'notifications', color: theme.colors.primary, bg: 'rgba(255, 215, 0, 0.12)' };
    }
  };

  const handleItemPress = async (item: Notification) => {
    if (!item.isRead) {
      try {
        await markRead(item._id).unwrap();
      } catch (err) {
        console.error('[NotificationScreen] Mark read failed:', err);
      }
    }

    if (item.metadata?.rideId) {
      // If notification has an active ride mapping, navigate to Ride Tracking
      navigation.navigate('RideTracking');
    }
  };

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

  const renderItem = ({ item }: { item: Notification }) => {
    const iconConfig = getIconConfig(item.notificationType);
    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          { 
            backgroundColor: item.isRead ? theme.colors.card : (isDark ? 'rgba(255, 215, 0, 0.08)' : 'rgba(255, 215, 0, 0.04)'), 
            borderColor: item.isRead ? theme.colors.border + '15' : theme.colors.primary + '50'
          }
        ]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.85}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}>
          <Ionicons name={iconConfig.name as any} size={20} color={iconConfig.color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text, fontWeight: item.isRead ? '600' : '800' }]}>
            {item.title}
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {item.body}
          </Text>
        </View>

        {!item.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      {/* Immersive Header Container */}
      <View style={styles.headerContainer}>
        <AuthHeader title="System Alerts" onBack={() => navigation.goBack()} />
        {notifications.length > 0 && (
          <TouchableOpacity 
            style={[styles.markAllButton, { borderColor: theme.colors.primary }]}
            onPress={handleMarkAllRead}
            disabled={isMarkingAll}
          >
            {isMarkingAll ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={[styles.markAllText, { color: theme.colors.primary }]}>Clear Unread</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={72} color={theme.colors.border} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Messages</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            We'll notify you here about discounts, active ride statuses, and secure system updates.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>{title}</Text>
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markAllText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
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
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
