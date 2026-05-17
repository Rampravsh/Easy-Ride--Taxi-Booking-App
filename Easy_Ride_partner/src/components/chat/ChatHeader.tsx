import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface ChatHeaderProps {
  customerName: string;
  customerRating?: string;
  avatarUrl?: string;
  rideScope?: string; // e.g. "Pickup: Terminal 2"
  onBack: () => void;
  onCall: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  customerName,
  customerRating = '4.8',
  avatarUrl,
  rideScope = 'Active Ride',
  onBack,
  onCall,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.avatarText, { color: theme.colors.textSecondary }]}>
              {customerName.charAt(0)}
            </Text>
          </View>
        )}

        <View style={styles.metaContainer}>
          <Text style={[styles.name, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
            {customerName}
          </Text>
          <View style={styles.subMeta}>
            <Ionicons name="star" size={12} color="#F5B800" />
            <Text style={[styles.rating, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {customerRating}
            </Text>
            <Text style={[styles.dot, { color: theme.colors.textSecondary }]}>•</Text>
            <Text style={[styles.scope, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]} numberOfLines={1}>
              {rideScope}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        onPress={onCall} 
        style={[styles.callBtn, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.8}
      >
        <Ionicons name="call" size={20} color={theme.colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    height: 70,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    paddingRight: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  subMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  dot: {
    fontSize: 12,
    marginHorizontal: 6,
  },
  scope: {
    fontSize: 12,
    flex: 1,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
