import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isVerified: boolean;
}

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onRemove?: (id: string) => void;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
  onRemove,
}) => {
  const { theme } = useTheme();

  const handleCall = () => {
    Linking.openURL(`tel:${contact.phone}`);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.leftSection}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
        </View>

        <View style={styles.details}>
          <Text style={[styles.name, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
            {contact.name}
          </Text>
          <View style={styles.row}>
            <Text style={[styles.subText, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {contact.relationship} • {contact.phone}
            </Text>
          </View>
          {contact.isVerified ? (
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
              <Text style={[styles.badgeText, { color: theme.colors.success, fontFamily: theme.typography.fontFamily.medium }]}>
                Verified
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, { backgroundColor: 'rgba(245, 184, 0, 0.1)' }]}>
              <Ionicons name="time" size={12} color={theme.colors.primary} />
              <Text style={[styles.badgeText, { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.medium }]}>
                Pending
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={handleCall} 
          style={[styles.actionBtn, { backgroundColor: theme.colors.surface }]}
          activeOpacity={0.7}
        >
          <Ionicons name="call" size={18} color={theme.colors.text} />
        </TouchableOpacity>
        
        {onRemove && (
          <TouchableOpacity 
            onPress={() => onRemove(contact.id)} 
            style={[styles.actionBtn, { backgroundColor: 'rgba(255, 69, 58, 0.1)' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={18} color={theme.colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subText: {
    fontSize: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
