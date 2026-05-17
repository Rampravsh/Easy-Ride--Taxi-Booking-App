import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { SurgeIndicator } from '../realtime/SurgeIndicator';

interface RideRequestCardProps {
  riderName: string;
  riderRating: number;
  pickupAddress: string;
  dropAddress: string;
  distance: string;
  duration: string;
  fareEstimate: string;
  surgeMultiplier?: number;
  onAccept: () => void;
  onDecline: () => void;
}

export const RideRequestCard: React.FC<RideRequestCardProps> = ({
  riderName,
  riderRating,
  pickupAddress,
  dropAddress,
  distance,
  duration,
  fareEstimate,
  surgeMultiplier = 1.0,
  onAccept,
  onDecline,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <View style={styles.riderInfo}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="person" size={24} color={theme.colors.textSecondary} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.riderName, { color: theme.colors.text }]}>{riderName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>{riderRating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <SurgeIndicator multiplier={surgeMultiplier} />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.addresses}>
        <View style={styles.timelineIndicators}>
          <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
          <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
          <View style={[styles.square, { backgroundColor: theme.colors.primary }]} />
        </View>
        <View style={styles.addressTextContainer}>
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>PICKUP</Text>
            <Text style={[styles.address, { color: theme.colors.text }]} numberOfLines={1}>{pickupAddress}</Text>
          </View>
          <View>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>DROP POINT</Text>
            <Text style={[styles.address, { color: theme.colors.text }]} numberOfLines={1}>{dropAddress}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>DISTANCE</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{distance}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>DURATION</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{duration}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>EST. FARE</Text>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>{fareEstimate}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.declineButton, { borderColor: theme.colors.border }]} 
          onPress={onDecline}
        >
          <Text style={[styles.declineText, { color: theme.colors.textSecondary }]}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.acceptButton, { backgroundColor: theme.colors.primary }]} 
          onPress={onAccept}
        >
          <Text style={styles.acceptText}>Accept Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  addresses: {
    flexDirection: 'row',
  },
  timelineIndicators: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  square: {
    width: 10,
    height: 10,
  },
  addressTextContainer: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  declineButton: {
    flex: 0.35,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineText: {
    fontSize: 15,
    fontWeight: '700',
  },
  acceptButton: {
    flex: 0.6,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
});
export default RideRequestCard;
