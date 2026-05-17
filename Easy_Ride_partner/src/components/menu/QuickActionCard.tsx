import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface QuickActionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBgColor?: string;
  iconColor?: string;
  onPress: () => void;
  badgeCount?: number;
  style?: StyleProp<ViewStyle>;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
  onPress,
  badgeCount = 0,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Badge Indicator */}
      {badgeCount > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.colors.danger }]}>
          <Text style={[styles.badgeText, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold }]}>
            {badgeCount > 9 ? '9+' : badgeCount}
          </Text>
        </View>
      )}

      {/* Main icon container */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBgColor || 'rgba(245, 184, 0, 0.1)',
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={24}
          color={iconColor || theme.colors.primary}
        />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily.semiBold,
          },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.regular,
            },
          ]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flex: 1,
    minWidth: 100,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    minHeight: 120,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 20,
  },
  badgeText: {
    fontSize: 10,
    textAlign: 'center',
  },
});
