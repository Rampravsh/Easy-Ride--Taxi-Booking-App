import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withDelay,
  withRepeat,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setOnboardingCompleted } from '../../redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  speed: number;
  rotation: number;
}

// Tiny helper to generate simulated confetti particles
const createConfettiParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: -20 - Math.random() * 100,
    size: 6 + Math.random() * 8,
    color: ['#F5B800', '#4CAF50', '#2196F3', '#FF5722', '#9C27B0'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 1500,
    speed: 3 + Math.random() * 4,
    rotation: Math.random() * 360,
  }));
};

/**
 * Dedicated Sub-Component to follow the Rules of Hooks.
 * Hook calls (useSharedValue, useAnimatedStyle, useEffect) are bound inside a proper Component instance.
 */
const ConfettiParticle = ({ p }: { p: Particle }) => {
  const particleY = useSharedValue(p.y);
  const particleRotation = useSharedValue(p.rotation);

  useEffect(() => {
    particleY.value = withDelay(p.delay, withTiming(height + 50, { duration: 2500 + p.speed * 200 }));
    particleRotation.value = withDelay(p.delay, withRepeat(withTiming(p.rotation + 360, { duration: 2000 }), -1, false));
  }, [p]);

  const animatedParticleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: particleY.value },
        { rotate: `${particleRotation.value}deg` }
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: p.x,
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          borderRadius: p.size / 2,
        },
        animatedParticleStyle,
      ]}
    />
  );
};

export const CongratulationsScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Congratulations'>>();
  const dispatch = useAppDispatch();

  // Fetch complete profile name from Redux
  const { backendUser } = useAppSelector((state) => state.auth);
  const userName = backendUser?.fullName?.split(' ')[0] || 'Passenger';

  const [countdown, setCountdown] = useState(3);
  const confettiParticles = useState(() => createConfettiParticles(40))[0];

  // Success icon animations
  const iconScale = useSharedValue(0.3);
  const iconOpacity = useSharedValue(0);

  const handleFinishOnboarding = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Setting onboardingCompleted = true in Redux saves it to AsyncStorage persistently
    // and causes index.tsx to dynamically swap Auth stack with Main dashboard Navigator!
    dispatch(setOnboardingCompleted(true));
  };

  useEffect(() => {
    // Elegant entrance spring
    iconScale.value = withSpring(1, { damping: 10 });
    iconOpacity.value = withTiming(1, { duration: 600 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Countdown and routing switcher
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishOnboarding();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
      opacity: iconOpacity.value,
    };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      {/* Render Floating Confetti Particles legally using a sub-component */}
      {confettiParticles.map((p) => (
        <ConfettiParticle key={p.id} p={p} />
      ))}

      <View style={styles.content}>
        {/* Animated Big success badge */}
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <View style={[styles.iconPulse, { backgroundColor: isDark ? 'rgba(76,175,80,0.15)' : '#E8F5E9' }]} />
          <View style={[styles.iconCore, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="checkmark" size={54} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* Text descriptions */}
        <Animated.View style={styles.textGroup} entering={FadeInDown.delay(200)}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
            Welcome to Easy Ride, {userName}!
          </Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Your secure rider identity is fully set up, permissions verified, and biometric shield activated. You are ready to book captains.
          </Text>
        </Animated.View>
      </View>

      {/* Routing switcher and timer countdown */}
      <Animated.View style={styles.footer} entering={FadeInDown.delay(400)}>
        <View style={[styles.countdownCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.spinner} />
          <Text style={[styles.countdownText, { color: theme.colors.text }]}>
            Redirecting to dashboard in <Text style={[styles.timeLabel, { color: theme.colors.primary }]}>{countdown}s</Text>
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  iconPulse: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 70,
    transform: [{ scale: 1.15 }],
  },
  iconCore: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  textGroup: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    zIndex: 10,
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: radius.button,
    borderWidth: 1,
    width: '100%',
  },
  spinner: {
    marginRight: spacing.sm,
  },
  countdownText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
  },
  timeLabel: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
  },
});
