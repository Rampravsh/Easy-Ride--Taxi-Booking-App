import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  withSpring
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography, radius } from '../../theme';
import { useAppDispatch } from '../../redux/hooks';
import { loginWithFirebaseThunk } from '../../redux/slices/authSlice';
import { AppButton } from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';

type OtpRouteProp = RouteProp<AuthStackParamList, 'OtpVerification'>;

export const OtpVerificationScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>>();
  const route = useRoute<OtpRouteProp>();
  const dispatch = useAppDispatch();

  // Navigation params (supports phone number and confirmationResult passed from PhoneAuthScreen)
  const { value: phoneNumber, confirmationResult } = route.params || { value: '', confirmationResult: null };

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // Focus and shake animation shared values
  const cellScale = Array.from({ length: 6 }, () => useSharedValue(1));
  const shakeX = useSharedValue(0);

  // Hidden real text input ref
  const hiddenInputRef = useRef<TextInput>(null);

  // Focus the input initially
  useEffect(() => {
    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 400);
  }, []);

  // Timer countdown handler
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle cell focus micro-animations
  const activeIndex = otp.join('').length;

  useEffect(() => {
    // Animate scale of the current active cell
    cellScale.forEach((val, idx) => {
      if (idx === activeIndex) {
        val.value = withSpring(1.08, { damping: 10 });
      } else {
        val.value = withTiming(1, { duration: 150 });
      }
    });

    // Auto submit check
    if (otp.join('').length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleInputChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const otpArray = ['', '', '', '', '', ''];
    for (let i = 0; i < 6; i++) {
      otpArray[i] = cleanText[i] || '';
    }
    setOtp(otpArray);
    if (error) setError(null);
  };

  const triggerShake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      triggerShake();
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (!confirmationResult) {
        throw new Error('Verification session lost. Please go back.');
      }

      console.log(`[OtpVerificationScreen] Confirming verification code...`);
      // Verify in Firebase Auth client
      const firebaseUserCredential = await confirmationResult.confirm(code);
      const user = firebaseUserCredential.user;
      
      // Get the verified ID token
      const token = await user.getIdToken(true);
      
      console.log('[OtpVerificationScreen] Token acquired. Synchronizing with backend server...');
      
      // Sync user profile in Redux using RTK Query/AuthService link
      const syncResultAction = await dispatch(loginWithFirebaseThunk({
        token,
        role: 'user',
        firebaseUser: user
      }));

      if (loginWithFirebaseThunk.fulfilled.match(syncResultAction)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        const backendUser = syncResultAction.payload.backendUser;
        const isProfileComplete = !!(backendUser.fullName && backendUser.email);
        
        setLoading(false);
        
        if (isProfileComplete) {
          // Returning user is complete, transition straight to location request/main
          navigation.navigate('EnableLocation');
        } else {
          // Brand new user needs to complete profile details first
          navigation.navigate('CompleteProfile');
        }
      } else {
        throw new Error(syncResultAction.payload as string || 'Backend sync failed');
      }
    } catch (err: any) {
      console.error('[OtpVerificationScreen] Verification failed:', err);
      triggerShake();
      setError(err.message || 'Incorrect verification code. Please try again.');
      setLoading(false);
      setOtp(['', '', '', '', '', '']);
      hiddenInputRef.current?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimer(60);
    setError(null);
    setOtp(['', '', '', '', '', '']);
    // Re-trigger verification flow locally via screen fallback logic
    console.log('[OtpVerificationScreen] Resending OTP to: ', phoneNumber);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeX.value }],
    };
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Enter 6-digit Code</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Code sent to <Text style={[styles.phoneHighlight, { color: theme.colors.text }]}>{phoneNumber || 'your phone number'}</Text>
          </Text>

          {/* Hidden text input to receive keyboard events */}
          {/* Bulletproof wrapper to overlay hidden text input on top of visual grid */}
          <View style={styles.otpInputWrapper}>
            <TextInput
              ref={hiddenInputRef}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={6}
              value={otp.join('')}
              onChangeText={handleInputChange}
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              caretHidden={true}
            />

            {/* Animated custom visual OTP grid */}
            <Animated.View style={[styles.otpGrid, containerAnimatedStyle]}>
              {otp.map((digit, index) => {
                const cellAnimatedStyle = useAnimatedStyle(() => {
                  return {
                    transform: [{ scale: cellScale[index].value }],
                    borderColor: error 
                      ? theme.colors.danger 
                      : index === activeIndex 
                        ? theme.colors.primary 
                        : theme.colors.border,
                  };
                });

                return (
                  <Animated.View 
                    key={index} 
                    style={[
                      styles.otpCell, 
                      { backgroundColor: theme.colors.surface }, 
                      cellAnimatedStyle
                    ]}
                  >
                    <Text style={[styles.cellText, { color: theme.colors.text }]}>
                      {digit}
                    </Text>
                    {index === activeIndex && !loading && (
                      <View style={[styles.cursor, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </Animated.View>
                );
              })}
            </Animated.View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.danger} />
              <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
            </View>
          )}

          {/* Resend Code Options */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
                Resend code in <Text style={[styles.timerText, { color: theme.colors.primary }]}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
                <Text style={[styles.resendActiveText, { color: theme.colors.primary }]}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading && (
          <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
            <View style={[styles.loadingBox, { backgroundColor: theme.colors.surface }]}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>Verifying OTP...</Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <AppButton 
            title="Verify & Continue" 
            onPress={handleVerifyOTP} 
            loading={loading}
            disabled={otp.join('').length < 6 || loading}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            textStyle={{ color: '#111111', fontFamily: 'Poppins-Bold', fontWeight: '700' }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  phoneHighlight: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  otpInputWrapper: {
    position: 'relative',
    marginVertical: spacing.md,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
    zIndex: 10,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpCell: {
    width: 48,
    height: 56,
    borderRadius: radius.input,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cellText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 20,
    borderRadius: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginLeft: 6,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  timerText: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  resendBtn: {
    padding: spacing.xs,
  },
  resendActiveText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footer: {
    padding: spacing.lg,
  },
  button: {
    height: 56,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    padding: spacing.xl,
    borderRadius: radius.card,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
  },
});
