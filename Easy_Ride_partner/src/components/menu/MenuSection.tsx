import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
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
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 11,
    letterSpacing: 1.1,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  content: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
