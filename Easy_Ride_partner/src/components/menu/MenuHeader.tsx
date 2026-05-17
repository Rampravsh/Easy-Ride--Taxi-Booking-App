import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface MenuHeaderProps {
  name: string;
  rating: number;
  vehicleModel: string;
  vehiclePlate: string;
  isVerified?: boolean;
  avatarUrl?: string;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  name,
  rating,
  vehicleModel,
  vehiclePlate,
  isVerified = true,
  avatarUrl,
}) => {
  const { theme } = useTheme();

  // Get initials for profile placeholder
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.profileRow}>
        {/* Avatar or Placeholder */}
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.avatarText, { color: theme.colors.black, fontFamily: theme.typography.fontFamily.bold }]}>
              {getInitials(name)}
            </Text>
          </View>
        )}

        {/* Profile Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                {
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
              numberOfLines={1}
            >
              {name}
            </Text>
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
              </View>
            )}
          </View>

          {/* Rating and Verification details */}
          <View style={styles.metaRow}>
            <View style={[styles.ratingPill, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="star" size={12} color="#F5B800" />
              <Text
                style={[
                  styles.ratingText,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily.bold,
                  },
                ]}
              >
                {rating.toFixed(2)}
              </Text>
            </View>
            <Text
              style={[
                styles.statusText,
                {
                  color: '#4CAF50',
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
            >
              ACTIVE & COMPLIANT
            </Text>
          </View>
        </View>
      </View>

      {/* Vehicle Info Section */}
      <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

      <View style={styles.vehicleRow}>
        <View style={styles.vehicleLeft}>
          <Ionicons name="car-sport" size={20} color={theme.colors.primary} />
          <View style={styles.vehicleDetails}>
            <Text
              style={[
                styles.vehicleModelText,
                {
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.semiBold,
                },
              ]}
              numberOfLines={1}
            >
              {vehicleModel}
            </Text>
            <Text
              style={[
                styles.vehicleSubText,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              Active Operational Vehicle
            </Text>
          </View>
        </View>
        
        <View style={[styles.plateBadge, { backgroundColor: theme.isDark ? '#3A3A3C' : '#E5E7EB' }]}>
          <Text
            style={[
              styles.plateText,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.bold,
              },
            ]}
          >
            {vehiclePlate}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    letterSpacing: 1,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    maxWidth: '85%',
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleModelText: {
    fontSize: 14,
  },
  vehicleSubText: {
    fontSize: 11,
    marginTop: 1,
  },
  plateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  plateText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
