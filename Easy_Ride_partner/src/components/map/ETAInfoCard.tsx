import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface ETAInfoCardProps {
  eta: string;
  distance: string;
  time: string;
  onPress?: () => void;
}

export const ETAInfoCard = ({
  eta,
  distance,
  time,
  onPress,
}: ETAInfoCardProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.left}>
        <Text style={[styles.etaValue, { color: theme.colors.success }]}>{eta}</Text>
        <Text style={[styles.etaLabel, { color: theme.colors.textSecondary }]}>ETA ARRIVAL</Text>
      </View>
      
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />

      <View style={styles.center}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>{distance}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>DISTANCE</Text>
      </View>

      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />

      <View style={styles.right}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>{time}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>DURATION</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginHorizontal: 16,
  },
  left: {
    alignItems: 'center',
    flex: 1,
  },
  etaValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  etaLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  line: {
    width: 1,
    height: 28,
  },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  right: {
    alignItems: 'center',
    flex: 1,
  },
});
export default ETAInfoCard;
