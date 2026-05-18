import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { useAppDispatch } from '../../redux/hooks';
import { setBiometricEnabled } from '../../redux/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';

export const BiometricSetupScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'BiometricSetup'>>();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [isBiometricsSupported, setIsBiometricsSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('Face ID / Touch ID');

  // Animation shared values for FaceID scanning simulation
  const scanScale = useSharedValue(1);
  const scanRotate = useSharedValue(0);

  useEffect(() => {
    // Elegant pulsing and spinning scanners
    scanScale.value = withRepeat(
      withTiming(1.08, { duration: 1500 }),
      -1,
      true
    );
    scanRotate.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false
    );

    checkDeviceBiometrics();
  }, []);

  const checkDeviceBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      const supported = hasHardware && isEnrolled;
      setIsBiometricsSupported(supported);

      if (hasHardware) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Touch ID / Fingerprint');
        }
      }
    } catch (err) {
      console.warn('[BiometricSetupScreen] Error checking hardware support:', err);
    }
  };

  const scanAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scanScale.value },
      ],
    };
  });

  const handleSetupBiometrics = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setLoading(false);
        dispatch(setBiometricEnabled(false));
        Alert.alert(
          'Biometrics Unsupported',
          'Your device does not support biometrics, or you have not registered Face ID/Fingerprints in your system settings. Proceeding with secure PIN fallback.',
          [{ text: 'Continue', onPress: () => navigation.navigate('Congratulations' as any) }]
        );
        return;
      }

      console.log('[BiometricSetupScreen] Prompting local biometric authorization...');
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable secure access to Easy Ride using ${biometricType}`,
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        dispatch(setBiometricEnabled(true));
        
        Alert.alert(
          'Security Completed',
          `Perfect! ${biometricType} enabled successfully for faster bookings.`,
          [{ text: 'Proceed', onPress: () => navigation.navigate('Congratulations' as any) }]
        );
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        dispatch(setBiometricEnabled(false));
        Alert.alert(
          'Setup Incomplete',
          'Biometric confirmation failed. You can enable this later inside Settings.',
          [{ text: 'Continue anyway', onPress: () => navigation.navigate('Congratulations' as any) }]
        );
      }
    } catch (err: any) {
      console.error('[BiometricSetupScreen] Biometric verification crashed:', err);
      dispatch(setBiometricEnabled(false));
      navigation.navigate('Congratulations' as any);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(setBiometricEnabled(false));
    navigation.navigate('Congratulations' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      {/* Header step tracking */}
      <View style={styles.topHeader}>
        <Text style={[styles.progressLabel, { color: theme.colors.primary }]}>STEP 4 OF 4</Text>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Premium visual scanning animation */}
        <View style={styles.visualContainer}>
          <Animated.View 
            style={[
              styles.scanCircle, 
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }, 
              scanAnimatedStyle
            ]}
          >
            {biometricType.includes('Face') ? (
              <Ionicons name="scan-outline" size={80} color={theme.colors.primary} />
            ) : (
              <Ionicons name="finger-print" size={80} color={theme.colors.primary} />
            )}
          </Animated.View>
        </View>

        {/* Text descriptions */}
        <Animated.View style={styles.textGroup} entering={FadeInDown.delay(100)}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Secure with {biometricType}</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            Secure your rides receipts, wallet assets, and enable lightning-fast lockscreen unlocks by confirming your identity.
          </Text>
        </Animated.View>

        {/* Rationale information badges */}
        <Animated.View style={styles.bulletsContainer} entering={FadeInDown.delay(200)}>
          <View style={[styles.benefitCard, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="shield-checkmark" size={24} color={theme.colors.success} style={styles.benefitIcon} />
            <View style={styles.benefitText}>
              <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>Military-Grade Privacy</Text>
              <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>
                We do not store biometric records on database. Authentication happens locally on your secure enclave.
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <AppButton 
          title={loading ? 'Checking hardware...' : `Set Up ${biometricType}`} 
          onPress={handleSetupBiometrics} 
          loading={loading}
          disabled={loading}
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          textStyle={styles.primaryButtonText}
        />
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleSkip}>
          <Text style={[styles.secondaryBtnText, { color: theme.colors.textSecondary }]}>Not now, use system passcode</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  skipBtn: {
    padding: spacing.xs,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  visualContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  scanCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  bulletsContainer: {
    paddingHorizontal: spacing.sm,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.card,
    padding: spacing.md,
  },
  benefitIcon: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  primaryButton: {
    height: 56,
    borderRadius: radius.button,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  secondaryBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    padding: spacing.sm,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
});
