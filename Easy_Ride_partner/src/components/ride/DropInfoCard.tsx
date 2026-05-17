import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface DropInfoCardProps {
  dropAddress: string;
  onEndRidePress?: () => void;
}

export const DropInfoCard = ({
  dropAddress,
  onEndRidePress,
}: DropInfoCardProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.headerRow}>
        <View style={[styles.dotContainer, { backgroundColor: theme.colors.danger + '15' }]}>
          <View style={[styles.redDot, { backgroundColor: theme.colors.danger }]} />
        </View>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>DESTINATION DROP POINT</Text>
      </View>

      <Text style={[styles.addressText, { color: theme.colors.text }]} numberOfLines={2}>
        {dropAddress}
      </Text>

      {onEndRidePress && (
        <TouchableOpacity 
          style={[styles.endRideBtn, { backgroundColor: theme.colors.danger }]}
          onPress={onEndRidePress}
          activeOpacity={0.8}
        >
          <Ionicons name="stop-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.endRideText}>COMPLETE TRIP (SLIDE / TAP)</Text>
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
  redDot: {
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
    marginBottom: 16,
    paddingLeft: 4,
  },
  endRideBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  endRideText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
export default DropInfoCard;
