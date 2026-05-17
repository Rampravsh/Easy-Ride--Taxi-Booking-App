import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';

interface IssueStatusBadgeProps {
  status: TicketStatus;
}

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({ status }) => {
  const { theme } = useTheme();

  const getStyleConfig = () => {
    switch (status) {
      case 'open':
        return {
          bg: 'rgba(245, 184, 0, 0.1)',
          border: theme.colors.primary,
          color: theme.colors.text,
          label: 'Open',
        };
      case 'pending':
        return {
          bg: 'rgba(0, 122, 255, 0.1)',
          border: '#007AFF',
          color: '#007AFF',
          label: 'In Review',
        };
      case 'resolved':
        return {
          bg: 'rgba(76, 175, 80, 0.1)',
          border: theme.colors.success,
          color: theme.colors.success,
          label: 'Resolved',
        };
      default:
        return {
          bg: theme.colors.surface,
          border: theme.colors.border,
          color: theme.colors.textSecondary,
          label: 'Closed',
        };
    }
  };

  const config = getStyleConfig();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: config.color,
            fontFamily: theme.typography.fontFamily.semiBold,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
