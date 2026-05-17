import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface EarningsCardProps {
  todayEarnings: string;
  onlineHours: string;
  tripsCount: number;
  acceptanceRate: string;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({
  todayEarnings,
  onlineHours,
  tripsCount,
  acceptanceRate,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.title, { color: theme.colors.textSecondary }]}>TODAY'S EARNINGS</Text>
          <Text style={[styles.amount, { color: theme.colors.primary }]}>{todayEarnings}</Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} style={{ marginBottom: 4 }} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{onlineHours}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Online Hrs</Text>
        </View>

        <View style={styles.statCol}>
          <Ionicons name="car-outline" size={16} color={theme.colors.textSecondary} style={{ marginBottom: 4 }} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{tripsCount}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Trips</Text>
        </View>

        <View style={styles.statCol}>
          <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.textSecondary} style={{ marginBottom: 4 }} />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{acceptanceRate}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Acceptance</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: '900',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
export default EarningsCard;
