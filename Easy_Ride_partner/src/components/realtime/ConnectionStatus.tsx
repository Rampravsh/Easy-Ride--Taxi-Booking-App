import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface ConnectionStatusProps {
  status: 'excellent' | 'fair' | 'disconnected';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case 'excellent':
        return {
          icon: 'wifi',
          color: theme.colors.success,
          text: 'GPS Excellent',
        };
      case 'fair':
        return {
          icon: 'wifi-outline',
          color: theme.colors.primary,
          text: 'GPS Fair',
        };
      case 'disconnected':
        default:
        return {
          icon: 'alert-circle',
          color: theme.colors.danger,
          text: 'GPS Disconnected',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Ionicons name={config.icon as any} size={14} color={config.color} />
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
});
export default ConnectionStatus;
