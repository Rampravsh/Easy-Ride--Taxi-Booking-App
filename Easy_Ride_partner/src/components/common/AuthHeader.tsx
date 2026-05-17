import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme, spacing, radius, typography } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface AuthHeaderProps {
  title?: string;
  onBack?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, onBack }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity 
          onPress={onBack} 
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      {title && <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.size.section,
    fontWeight: '700',
    marginLeft: spacing.md,
  },
});
