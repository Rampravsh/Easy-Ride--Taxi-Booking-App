import React from 'react';
import { View, Text, StyleSheet, Switch, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface ToggleSettingCardProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  statusText?: string;
}

export const ToggleSettingCard: React.FC<ToggleSettingCardProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  style,
  statusText,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <View style={styles.contentContainer}>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: iconBgColor || 'rgba(245, 184, 0, 0.1)',
              },
            ]}
          >
            <Ionicons
              name={icon as any}
              size={22}
              color={iconColor || theme.colors.primary}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.semiBold,
              },
            ]}
          >
            {title}
          </Text>
          {description && (
            <Text
              style={[
                styles.description,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {description}
            </Text>
          )}
          {statusText && (
            <Text
              style={[
                styles.statusText,
                {
                  color: value ? theme.colors.success : theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.medium,
                },
              ]}
            >
              {statusText}
            </Text>
          )}
        </View>
        <View style={styles.switchWrapper}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{
              false: theme.isDark ? '#3A3A3C' : '#E5E7EB',
              true: 'rgba(245, 184, 0, 0.3)',
            }}
            thumbColor={value ? theme.colors.primary : theme.isDark ? '#AEAEB2' : '#F3F4F6'}
            ios_backgroundColor={theme.isDark ? '#3A3A3C' : '#E5E7EB'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  statusText: {
    fontSize: 12,
    marginTop: 6,
  },
  switchWrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
