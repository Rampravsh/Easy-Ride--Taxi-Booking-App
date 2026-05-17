import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface ActiveRideHeaderProps {
  tripStatus: 'pickup' | 'inprogress' | 'completed';
  eta: string;
  distance: string;
  onBackPress?: () => void;
}

export const ActiveRideHeader = ({
  tripStatus,
  eta,
  distance,
  onBackPress,
}: ActiveRideHeaderProps) => {
  const { theme } = useTheme();

  const getStatusText = () => {
    switch (tripStatus) {
      case 'pickup':
        return 'NAVIGATING TO PICKUP';
      case 'inprogress':
        return 'TRIP IN PROGRESS';
      case 'completed':
        return 'TRIP COMPLETED';
    }
  };

  const getStatusColor = () => {
    switch (tripStatus) {
      case 'pickup':
        return theme.colors.primary;
      case 'inprogress':
        return theme.colors.success;
      case 'completed':
        return '#0284C7';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
      <View style={styles.headerRow}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
          </View>
          <Text style={[styles.subTitle, { color: theme.colors.textSecondary }]}>
            {eta} • {distance} remaining
          </Text>
        </View>
        <TouchableOpacity style={[styles.safetyButton, { backgroundColor: theme.colors.danger + '15' }]}>
          <Ionicons name="shield-checkmark" size={22} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  safetyButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ActiveRideHeader;
