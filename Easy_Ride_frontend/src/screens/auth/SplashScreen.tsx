import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withTiming
} from 'react-native-reanimated';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing } from '../../theme';
import { useAppSelector } from '../../redux/hooks';

const { width } = Dimensions.get('window');

export const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Splash'>>();
  const { theme, isDark } = useTheme();
  
  // Fetch onboarding state from store
  const { onboardingCompleted, authenticated } = useAppSelector((state) => state.auth);

  // Animation values
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  useEffect(() => {
    // Start animation immediately
    logoScale.value = withSpring(1, { damping: 12 });
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { damping: 15 }));

    // Navigation orchestration
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const onAnimationComplete = () => {
    if (authenticated) {
      // If already authenticated, the root navigator (index.tsx) will switch to Main automatically
      return;
    }

    if (onboardingCompleted) {
      navigation.replace('Welcome');
    } else {
      // Go to onboarding walkthrough or directly to permissions/welcome
      navigation.replace('Onboarding1');
    }
  };

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTranslateY.value }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      
      {/* Premium Gradient Overlay approximation via layout */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: isDark ? '#121214' : '#F5B800' }]} />
      
      {/* Decorative premium motion background elements */}
      <View style={[styles.circle, { backgroundColor: isDark ? '#1C1C1E' : '#FFCD38', top: -100, right: -100 }]} />
      <View style={[styles.circle, { backgroundColor: isDark ? '#2C2C2E' : '#EAA200', bottom: -150, left: -150 }]} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoWrapper, animatedLogoStyle]}>
          <View style={[styles.logoOutline, { borderColor: '#FFFFFF' }]}>
            <Text style={styles.logoIcon}>🚗</Text>
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.titleWrapper, animatedTitleStyle]}>
          <Text style={styles.title}>EASY RIDE</Text>
          <Text style={[styles.subtitle, { color: isDark ? theme.colors.textSecondary : '#FFF9E6' }]}>
            Premium Mobility Solutions
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    marginBottom: spacing.xl,
  },
  logoOutline: {
    width: 110,
    height: 110,
    borderRadius: 36,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 54,
  },
  titleWrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  circle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
});
