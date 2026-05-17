import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface PassengerInfoCardProps {
  passengerName: string;
  rating: number;
  tripType?: string;
  onCallPress?: () => void;
  onChatPress?: () => void;
}

export const PassengerInfoCard = ({
  passengerName,
  rating,
  tripType = 'EASY GO',
  onCallPress,
  onChatPress,
}: PassengerInfoCardProps) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.leftCol}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="person" size={24} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.infoCol}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{passengerName}</Text>
          <View style={styles.detailsRow}>
            <View style={[styles.badge, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="star" size={10} color={theme.colors.primary} />
              <Text style={[styles.ratingText, { color: theme.colors.text }]}>{rating.toFixed(1)}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.colors.primary + '15' }]}>
              <Text style={[styles.tripTypeText, { color: theme.colors.primary }]}>{tripType}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.rightCol}>
        {onChatPress && (
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}
            onPress={onChatPress}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        {onCallPress && (
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}
            onPress={onCallPress}
          >
            <Ionicons name="call-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },
  tripTypeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
export default PassengerInfoCard;
