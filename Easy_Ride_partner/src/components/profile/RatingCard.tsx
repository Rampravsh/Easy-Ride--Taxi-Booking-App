import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RatingCardProps {
  rating: number;
  totalTrips: number;
  fiveStarPercent: number; // e.g. 0.95
}

export const RatingCard: React.FC<RatingCardProps> = ({
  rating,
  totalTrips,
  fiveStarPercent,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.top}>
        <View>
          <Text style={[styles.title, { color: theme.colors.textSecondary }]}>DRIVER RATING</Text>
          <View style={styles.ratingRow}>
            <Text style={[styles.rating, { color: theme.colors.text }]}>{rating.toFixed(2)}</Text>
            <Ionicons name="star" size={20} color="#FFC107" style={{ marginLeft: 6 }} />
          </View>
        </View>
        <View style={styles.right}>
          <Text style={[styles.trips, { color: theme.colors.text }]}>{totalTrips}</Text>
          <Text style={[styles.tripsLabel, { color: theme.colors.textSecondary }]}>Total Trips</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>5-Star Feedback</Text>
          <Text style={[styles.progressVal, { color: theme.colors.text }]}>{Math.round(fiveStarPercent * 100)}%</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { backgroundColor: theme.colors.success, width: `${fiveStarPercent * 100}%` }
            ]} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 24,
    fontWeight: '900',
  },
  right: {
    alignItems: 'flex-end',
  },
  trips: {
    fontSize: 20,
    fontWeight: '900',
  },
  tripsLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  progressSection: {
    width: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '700',
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
export default RatingCard;
