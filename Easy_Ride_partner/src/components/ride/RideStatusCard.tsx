import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface RideStatusCardProps {
  status: 'enroute_pickup' | 'arrived' | 'enroute_dropoff' | 'completed';
  riderName: string;
  destination: string;
  eta: string;
  onCall: () => void;
  onChat: () => void;
}

export const RideStatusCard: React.FC<RideStatusCardProps> = ({
  status,
  riderName,
  destination,
  eta,
  onCall,
  onChat,
}) => {
  const { theme } = useTheme();

  const getStatusText = () => {
    switch (status) {
      case 'enroute_pickup':
        return 'Enroute to Pickup';
      case 'arrived':
        return 'Arrived at Pickup';
      case 'enroute_dropoff':
        return 'Heading to Destination';
      case 'completed':
        return 'Ride Completed';
      default:
        return 'Active Trip';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.statusTitle, { color: theme.colors.primary }]}>{getStatusText()}</Text>
          <Text style={[styles.etaText, { color: theme.colors.text }]}>ETA: {eta}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]} 
            onPress={onChat}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.colors.surface, marginLeft: 8 }]} 
            onPress={onCall}
          >
            <Ionicons name="call" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.riderRow}>
        <View style={[styles.avatarBox, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.riderDetails}>
          <Text style={[styles.riderName, { color: theme.colors.text }]}>{riderName}</Text>
          <Text style={[styles.destinationText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            To: {destination}
          </Text>
        </View>
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
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  etaText: {
    fontSize: 18,
    fontWeight: '900',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderDetails: {
    marginLeft: 12,
    flex: 1,
  },
  riderName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  destinationText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
// Simple helper fix for justify center typo
const justify = (val: string) => val;
export default RideStatusCard;
