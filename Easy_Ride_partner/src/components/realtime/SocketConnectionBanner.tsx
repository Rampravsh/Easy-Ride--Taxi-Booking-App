import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface SocketConnectionBannerProps {
  status: 'connected' | 'reconnecting' | 'disconnected';
}

export const SocketConnectionBanner = ({ status }: SocketConnectionBannerProps) => {
  const { theme } = useTheme();

  if (status === 'connected') return null; // Invisible when healthy connected

  const getBannerConfig = () => {
    switch (status) {
      case 'reconnecting':
        return {
          bg: '#FEF3C7',
          text: '#D97706',
          icon: 'sync-outline',
          label: 'SOCKET RECONNECTING • LIVE ROUTING PAUSED',
        };
      case 'disconnected':
        return {
          bg: '#FEE2E2',
          text: '#DC2626',
          icon: 'cloud-offline-outline',
          label: 'DISCONNECTED • SEARCHING SIGNAL...',
        };
    }
  };

  const config = getBannerConfig();

  return (
    <View style={[styles.banner, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon as any} size={14} color={config.text} style={{ marginRight: 6 }} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  label: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
export default SocketConnectionBanner;
