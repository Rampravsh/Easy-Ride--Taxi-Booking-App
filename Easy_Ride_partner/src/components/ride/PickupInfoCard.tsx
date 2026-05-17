import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface PickupInfoCardProps {
  pickupAddress: string;
  passengerName: string;
  onArrivedPress?: () => void;
  isArrived: boolean;
}

export const PickupInfoCard = ({
  pickupAddress,
  passengerName,
  onArrivedPress,
  isArrived,
}: PickupInfoCardProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.headerRow}>
        <View style={[styles.dotContainer, { backgroundColor: theme.colors.success + '15' }]}>
          <View style={[styles.greenDot, { backgroundColor: theme.colors.success }]} />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>PICKUP POINT</Text>
      </View>

      <Text style={[styles.addressText, { color: theme.colors.text }]} numberOfLines={2}>
        {pickupAddress}
      </Text>

      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.passengerRow}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="person" size={18} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.passengerInfo}>
          <Text style={[styles.passengerNameText, { color: theme.colors.text }]}>{passengerName}</Text>
          <Text style={[styles.passengerStatus, { color: theme.colors.textSecondary }]}>Rider is waiting at pickup</Text>
        </View>
      </View>

      {onArrivedPress && (
        <TouchableOpacity 
          style={[
            styles.arrivedBtn, 
            { backgroundColor: isArrived ? theme.colors.success : theme.colors.primary }
          ]}
          onPress={onArrivedPress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isArrived ? "checkmark-circle" : "flag"} 
            size={20} 
            color="#111111" 
            style={{ marginRight: 8 }} 
          />
          <Text style={styles.arrivedText}>
            {isArrived ? 'DRIVER ARRIVED • READY TO START' : 'I HAVE ARRIVED'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 14,
    paddingLeft: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 14,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerNameText: {
    fontSize: 14,
    fontWeight: '800',
  },
  passengerStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  arrivedBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  arrivedText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 0.5,
  },
});
export default PickupInfoCard;
