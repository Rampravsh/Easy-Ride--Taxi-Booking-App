import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useTheme, spacing, typography, radius } from '../../theme';
import { AppButton } from '../../components/AppButton';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Welcome'>>();

  // Animation shared values
  const backgroundScale = useSharedValue(1.1);
  const contentTranslateY = useSharedValue(40);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    // Elegant entries
    backgroundScale.value = withTiming(1, { duration: 2500 });
    contentTranslateY.value = withSpring(0, { damping: 15 });
    contentOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: backgroundScale.value }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Fullscreen Immersive Map-themed Overlay background */}
      <Animated.Image 
        source={require('../../../assets/images/onboarding3.png')} 
        style={[styles.backgroundImage, animatedBackgroundStyle]}
        resizeMode="cover"
      />
      <View style={[styles.darkOverlay, { backgroundColor: isDark ? 'rgba(28,28,30,0.85)' : 'rgba(0,0,0,0.65)' }]} />

      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <View style={[styles.logoBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.logoText}>🚕</Text>
          </View>
          <Text style={styles.brandText}>EASY RIDE</Text>
        </View>

        <Animated.View style={[styles.content, animatedContentStyle]}>
          <Text style={styles.title}>Move with Style, Ease, and Security</Text>
          
          <Text style={styles.subtitle}>
            Your premium private chauffeur, dynamic route navigation, and instant smart transit ecosystem in one secure app.
          </Text>

          <View style={styles.buttonWrapper}>
            <AppButton 
              title="Continue with Phone" 
              onPress={() => navigation.navigate('OtpVerification', { type: 'phone', value: '', nextScreen: 'CompleteProfile' })} 
              style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
              textStyle={styles.primaryButtonText}
            />
            
            <View style={styles.footerTerms}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={[styles.linkText, { color: theme.colors.primary }]}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={[styles.linkText, { color: theme.colors.primary }]}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.6,
  },
  darkOverlay: {
    position: 'absolute',
    width: width,
    height: height,
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: 22,
  },
  brandText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.size.hero,
    fontFamily: 'Poppins-Bold',
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#E5E7EB',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  buttonWrapper: {
    width: '100%',
  },
  primaryButton: {
    height: 58,
    borderRadius: radius.button,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#111111',
    fontWeight: '700',
  },
  footerTerms: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
  },
});
