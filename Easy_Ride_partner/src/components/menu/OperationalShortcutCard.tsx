import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface OperationalShortcutCardProps {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
  onPress: () => void;
  progress?: number; // range 0 to 1
  footerText?: string;
  footerIcon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: StyleProp<ViewStyle>;
}

export const OperationalShortcutCard: React.FC<OperationalShortcutCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  onPress,
  progress,
  footerText,
  footerIcon,
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
      activeOpacity={0.8}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Ionicons
            name={icon as any}
            size={18}
            color={iconColor || theme.colors.primary}
          />
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.bold,
              },
            ]}
          >
            {title.toUpperCase()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
      </View>

      <Text
        style={[
          styles.value,
          {
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily.bold,
          },
        ]}
      >
        {value}
      </Text>

      {/* Progress Bar (Optional) */}
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: theme.colors.surface }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: theme.colors.primary,
                  width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Footer (Optional) */}
      {footerText && (
        <View style={styles.footerRow}>
          {footerIcon && (
            <Ionicons
              name={footerIcon as any}
              size={12}
              color={theme.colors.textSecondary}
              style={styles.footerIcon}
            />
          )}
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.medium,
              },
            ]}
          >
            {footerText}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 26,
    marginBottom: 10,
  },
  progressContainer: {
    height: 6,
    width: '100%',
    marginBottom: 10,
  },
  progressBarBackground: {
    height: '100%',
    width: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 4,
  },
  footerText: {
    fontSize: 11,
  },
});
