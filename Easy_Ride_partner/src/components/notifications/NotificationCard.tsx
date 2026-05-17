import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'earnings' | 'ride' | 'fraud' | 'support' | 'general';
  unread: boolean;
  actionRoute?: string;
}

interface NotificationCardProps {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ item, onPress }) => {
  const { theme } = useTheme();

  const getCategoryTheme = () => {
    switch (item.category) {
      case 'earnings':
        return { icon: 'cash', color: theme.colors.success, bg: 'rgba(76,175,80,0.1)' };
      case 'ride':
        return { icon: 'car', color: theme.colors.primary, bg: 'rgba(245,184,0,0.1)' };
      case 'fraud':
        return { icon: 'shield-half', color: theme.colors.danger, bg: 'rgba(229,57,53,0.1)' };
      case 'support':
        return { icon: 'chatbubble-ellipses', color: '#007AFF', bg: 'rgba(0,122,255,0.1)' };
      default:
        return { icon: 'notifications', color: theme.colors.textSecondary, bg: theme.colors.surface };
    }
  };

  const { icon, color, bg } = getCategoryTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: item.unread ? theme.colors.primary : theme.colors.border,
          borderLeftColor: color,
        },
      ]}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontFamily: item.unread ? theme.typography.fontFamily.semiBold : theme.typography.fontFamily.medium,
              },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {item.unread && (
            <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
          )}
        </View>
        <Text
          style={[
            styles.body,
            { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular },
          ]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <Text
          style={[
            styles.time,
            { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular },
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    flex: 1,
    paddingRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    opacity: 0.8,
  },
});
