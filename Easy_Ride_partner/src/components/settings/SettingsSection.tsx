import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface SettingsSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  subtitle,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily.bold,
              },
            ]}
          >
            {title.toUpperCase()}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
