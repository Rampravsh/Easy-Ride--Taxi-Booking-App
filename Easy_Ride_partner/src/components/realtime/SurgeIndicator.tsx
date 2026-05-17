import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface SurgeIndicatorProps {
  multiplier: number;
}

export const SurgeIndicator: React.FC<SurgeIndicatorProps> = ({ multiplier }) => {
  const { theme } = useTheme();

  if (multiplier <= 1.0) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Ionicons name="flame" size={14} color="#111111" style={{ marginRight: 4 }} />
      <Text style={styles.text}>{multiplier.toFixed(1)}x Surge</Text>
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
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.2,
  },
});
export default SurgeIndicator;
