import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { VerificationBadge } from './VerificationBadge';

interface ProfileHeaderProps {
  name: string;
  phone: string;
  verified: boolean;
  avatarUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  phone,
  verified,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <View style={[styles.avatarBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="person" size={48} color={theme.colors.textSecondary} />
        </View>
        <View style={styles.verifiedFloating}>
          <VerificationBadge verified={verified} />
        </View>
      </View>

      <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
      <Text style={[styles.phone, { color: theme.colors.textSecondary }]}>{phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedFloating: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    fontWeight: '600',
  },
});
export default ProfileHeader;
