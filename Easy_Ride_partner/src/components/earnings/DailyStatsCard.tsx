import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface DailyStatsCardProps {
  dayName: string;
  amount: string;
  trips: number;
  percentageFilled: number; // For progress bar (0 to 1)
}

export const DailyStatsCard: React.FC<DailyStatsCardProps> = ({
  dayName,
  amount,
  trips,
  percentageFilled,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.topRow}>
        <Text style={[styles.day, { color: theme.colors.text }]}>{dayName}</Text>
        <Text style={[styles.amount, { color: theme.colors.primary }]}>{amount}</Text>
      </View>
      <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>{trips} trips completed</Text>

      <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
        <View 
          style={[
            styles.progressFill, 
            { backgroundColor: theme.colors.primary, width: `${Math.min(100, percentageFilled * 100)}%` }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  day: {
    fontSize: 15,
    fontWeight: '800',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
  },
  sub: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
export default DailyStatsCard;
