import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface SafetyOptionCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  iconBgColor?: string;
  iconColor?: string;
}

export const SafetyOptionCard: React.FC<SafetyOptionCardProps> = ({
  icon,
  title,
  description,
  onPress,
  iconBgColor,
  iconColor,
}) => {
  const { theme } = useTheme();

  const finalIconBg = iconBgColor || theme.colors.surface;
  const finalIconColor = iconColor || theme.colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: finalIconBg }]}>
        <Ionicons name={icon as any} size={22} color={finalIconColor} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
          {description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    paddingRight: 8,
    gap: 2,
  },
  title: {
    fontSize: 15,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
});
