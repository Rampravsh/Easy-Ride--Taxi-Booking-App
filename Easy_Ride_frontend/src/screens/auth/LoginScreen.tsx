import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, typography, radius } from '../../theme';

export const LoginScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Welcome back!</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Sign in to continue</Text>
      
      <View style={[styles.placeholder, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={{color: theme.colors.textSecondary}}>Login form coming soon...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.size.hero,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: typography.size.body,
    marginBottom: spacing.xxl,
  },
  placeholder: {
    height: 200,
    borderRadius: radius.card,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  }
});
