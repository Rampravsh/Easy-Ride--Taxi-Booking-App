import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RideSyncIndicatorProps {
  syncState: 'synchronized' | 'syncing' | 'failed';
}

export const RideSyncIndicator = ({ syncState }: RideSyncIndicatorProps) => {
  const { theme } = useTheme();

  const getConfig = () => {
    switch (syncState) {
      case 'synchronized':
        return {
          color: theme.colors.success,
          text: 'CLOUD SYNCED',
          icon: 'cloud-done-outline',
        };
      case 'syncing':
        return {
          color: theme.colors.primary,
          text: 'SYNCING...',
          icon: 'sync-outline',
        };
      case 'failed':
        return {
          color: theme.colors.danger,
          text: 'SYNC ERROR',
          icon: 'cloud-offline-outline',
        };
    }
  };

  const config = getConfig();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Ionicons name={config.icon as any} size={11} color={config.color} style={{ marginRight: 4 }} />
      <Text style={[styles.text, { color: theme.colors.textSecondary }]}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
export default RideSyncIndicator;
