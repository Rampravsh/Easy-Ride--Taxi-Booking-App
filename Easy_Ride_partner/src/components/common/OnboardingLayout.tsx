import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingLayoutProps {
  image?: any;
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
          {image ? (
            <Image source={image} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surface }]}>
               <Ionicons name="car-outline" size={120} color={theme.colors.primary} />
            </View>
          )}
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
            <Text style={[styles.goText, { color: theme.colors.black }]}>Get Started</Text>
          ) : (
            <Ionicons name="arrow-forward" size={24} color={theme.colors.black} />
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
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    flex: 0.6,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    borderRadius: 125,
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
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 48,
    alignItems: 'center',
  },
  nextButton: {
    minWidth: 70,
    height: 70,
    borderRadius: 35,
    paddingHorizontal: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});
