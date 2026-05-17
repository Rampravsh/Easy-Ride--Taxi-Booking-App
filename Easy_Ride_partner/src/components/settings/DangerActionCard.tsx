import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface DangerActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  loading?: boolean;
}

export const DangerActionCard: React.FC<DangerActionCardProps> = ({
  title,
  description,
  buttonText,
  onPress,
  icon = 'warning',
  loading = false,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.isDark ? 'rgba(255, 69, 58, 0.05)' : 'rgba(229, 57, 53, 0.03)',
          borderColor: theme.isDark ? 'rgba(255, 69, 58, 0.2)' : 'rgba(229, 57, 53, 0.15)',
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.isDark ? 'rgba(255, 69, 58, 0.15)' : 'rgba(229, 57, 53, 0.08)',
            },
          ]}
        >
          <Ionicons
            name={icon as any}
            size={22}
            color={theme.isDark ? '#FF453A' : '#E53935'}
          />
        </View>
        <Text
          style={[
            styles.title,
            {
              color: theme.isDark ? '#FF453A' : '#E53935',
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          {title}
        </Text>
      </View>
      
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

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.isDark ? '#FF453A' : '#E53935',
          },
        ]}
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: theme.colors.white,
              fontFamily: theme.typography.fontFamily.semiBold,
            },
          ]}
        >
          {loading ? 'Processing...' : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 14,
  },
});
