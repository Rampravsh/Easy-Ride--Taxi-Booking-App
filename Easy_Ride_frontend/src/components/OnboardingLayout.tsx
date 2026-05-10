import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingLayoutProps {
  image: any;
  title: string;
  description: string;
  onNext: () => void;
  onSkip: () => void;
  isLast?: boolean;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  image,
  title,
  description,
  onNext,
  onSkip,
  isLast = false,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.background} 
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={onSkip}>
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: theme.colors.primary }]} 
          onPress={onNext}
        >
          {isLast ? (
            <Text style={styles.goText}>Go</Text>
          ) : (
            <Ionicons name="arrow-forward" size={24} color={theme.colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: typography.size.body,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  imageContainer: {
    flex: 0.6,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.size.title + 4,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.size.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  nextButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  goText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
