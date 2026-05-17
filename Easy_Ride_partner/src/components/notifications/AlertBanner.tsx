import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface AlertBannerProps {
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
  onPress?: () => void;
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'warning',
  title,
  message,
  onPress,
  onDismiss,
}) => {
  const { theme } = useTheme();

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'rgba(255, 69, 58, 0.1)',
          border: theme.colors.danger,
          text: theme.colors.danger,
          icon: 'alert-circle',
        };
      case 'info':
        return {
          bg: 'rgba(0, 122, 255, 0.1)',
          border: '#007AFF',
          text: '#007AFF',
          icon: 'information-circle',
        };
      default:
        return {
          bg: 'rgba(245, 184, 0, 0.1)',
          border: theme.colors.primary,
          text: theme.colors.text,
          icon: 'warning',
        };
    }
  };

  const currentColors = getColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentColors.bg,
          borderColor: currentColors.border,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.content} 
        onPress={onPress} 
        disabled={!onPress}
        activeOpacity={0.8}
      >
        <Ionicons name={currentColors.icon as any} size={22} color={currentColors.border} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.semiBold }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular }]}>
            {message}
          </Text>
        </View>
      </TouchableOpacity>

      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
  },
  closeBtn: {
    padding: 2,
  },
});
