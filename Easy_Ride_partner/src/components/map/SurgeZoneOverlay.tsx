import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface SurgeZoneOverlayProps {
  locationName: string;
  multiplier: number;
  riderCount: number;
}

export const SurgeZoneOverlay: React.FC<SurgeZoneOverlayProps> = ({
  locationName,
  multiplier,
  riderCount,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}>
      <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
        <Ionicons name="flame" size={16} color="#111111" />
        <Text style={styles.multiplier}>{multiplier.toFixed(1)}x</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.location, { color: theme.colors.text }]} numberOfLines={1}>
          {locationName}
        </Text>
        <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
          {riderCount} passengers searching
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 240,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  multiplier: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111111',
    marginLeft: 2,
  },
  textContainer: {
    flex: 1,
  },
  location: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  subText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
export default SurgeZoneOverlay;
