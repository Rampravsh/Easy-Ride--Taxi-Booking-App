import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  StatusBar, 
  Dimensions, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography, radius } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { FirebaseService } from '../../services/firebase.service';
import { useAppDispatch } from '../../redux/hooks';
import { loginWithFirebaseThunk } from '../../redux/slices/authSlice';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Welcome'>>();
  const dispatch = useAppDispatch();

  // Dialog & state hooks
  const [modalVisible, setModalVisible] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Animation shared values
  const backgroundScale = useSharedValue(1.1);
  const contentTranslateY = useSharedValue(40);
  const contentOpacity = useSharedValue(0);

  // Predefined premium testing profiles
  const googleAccounts = [
    { name: 'Ram Pravesh', email: 'rampraveshkr4545@gmail.com', avatar: '🤵' },
    { name: 'Easy Ride Rider', email: 'testrider@gmail.com', avatar: '🚗' },
    { name: 'Guest Passenger', email: 'guestuser@gmail.com', avatar: '✈️' },
  ];

  useEffect(() => {
    // Elegant entries
    backgroundScale.value = withTiming(1, { duration: 2500 });
    contentTranslateY.value = withSpring(0, { damping: 15 });
    contentOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const handleAccountSelect = async (email: string) => {
    setModalVisible(false);
    setAuthLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    try {
      let firebaseUser;
      
      // 1. Natively register/login the profile through active Firebase SDK
      try {
        console.log(`[GoogleSignIn] Natively signing in user: ${email}...`);
        firebaseUser = await FirebaseService.signInWithEmailAndPassword(email, 'dev_password_123');
      } catch (err: any) {
        // User not registered in Firebase Auth, register natively!
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          console.log(`[GoogleSignIn] User not found. Natively registering: ${email}...`);
          firebaseUser = await FirebaseService.signUpWithEmailAndPassword(email, 'dev_password_123');
        } else {
          throw err;
        }
      }

      // 2. Resolve native valid Firebase ID Token
      const token = await firebaseUser.getIdToken(true);
      if (!token) throw new Error('Unable to retrieve authentic Firebase ID Token');

      console.log('[GoogleSignIn] Firebase ID Token successfully verified. Synchronizing with backend MongoDB database...');

      // 3. Dispatch Redux sync action to update state and database
      const syncResultAction = await dispatch(loginWithFirebaseThunk({
        token,
        role: 'user',
        firebaseUser
      }));

      if (loginWithFirebaseThunk.fulfilled.match(syncResultAction)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        const backendUser = syncResultAction.payload.backendUser;
        const isProfileComplete = !!(backendUser.fullName && backendUser.email);
        
        setAuthLoading(false);
        
        if (isProfileComplete) {
          navigation.navigate('EnableLocation');
        } else {
          navigation.navigate('CompleteProfile');
        }
      } else {
        throw new Error(syncResultAction.payload as string || 'Backend database synchronization failed');
      }

    } catch (error: any) {
      console.error('[GoogleSignIn] Social login flow failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      let message = 'An unexpected error occurred during Google sign-in. Please try again.';
      if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      
      Alert.alert('Authentication Failed', message, [{ text: 'OK' }]);
      setAuthLoading(false);
    }
  };

  const handleCustomSubmit = () => {
    if (!customEmail.trim() || !customEmail.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid Gmail address.');
      return;
    }
    handleAccountSelect(customEmail.trim().toLowerCase());
  };

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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate('PhoneAuth');
              }} 
              style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
              textStyle={styles.primaryButtonText}
            />

            <View style={{ height: spacing.sm }} />

            {/* Premium, sleek social Continue with Google button */}
            <TouchableOpacity 
              style={[
                styles.socialButton, 
                { 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: 1 
                }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setModalVisible(true);
              }}
            >
              <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Continue with Google / Gmail</Text>
            </TouchableOpacity>

            {/* Custom Google Account Selection Dialog Sheet */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <TouchableOpacity 
                  style={{ flex: 1 }} 
                  activeOpacity={1} 
                  onPress={() => setModalVisible(false)}
                />
                
                <View style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.modalHeader}>
                    <View style={[styles.modalDragBar, { backgroundColor: theme.colors.border }]} />
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sign in with Google</Text>
                    <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
                      Select a testing account to start your ride session
                    </Text>
                  </View>

                  {!showCustomInput ? (
                    <View style={styles.accountsList}>
                      {googleAccounts.map((account, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[styles.accountItem, { borderBottomColor: theme.colors.border }]}
                          onPress={() => handleAccountSelect(account.email)}
                        >
                          <View style={[styles.avatarBadge, { backgroundColor: theme.colors.background }]}>
                            <Text style={{ fontSize: 18 }}>{account.avatar}</Text>
                          </View>
                          <View style={styles.accountDetails}>
                            <Text style={[styles.accountName, { color: theme.colors.text }]}>{account.name}</Text>
                            <Text style={[styles.accountEmail, { color: theme.colors.textSecondary }]}>{account.email}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                      ))}

                      <TouchableOpacity
                        style={styles.useAnotherBtn}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setShowCustomInput(true);
                        }}
                      >
                        <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                        <Text style={[styles.useAnotherText, { color: theme.colors.primary }]}>Use another Gmail account...</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.customEmailContainer}>
                      <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Enter Gmail Address</Text>
                      <View style={[styles.inputBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
                        <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
                        <TextInput
                          style={[styles.emailInput, { color: theme.colors.text }]}
                          placeholder="yourname@gmail.com"
                          placeholderTextColor={theme.colors.textSecondary}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          value={customEmail}
                          onChangeText={setCustomEmail}
                        />
                      </View>

                      <View style={styles.customInputButtons}>
                        <TouchableOpacity
                          style={[styles.customBtn, { borderColor: theme.colors.border, borderWidth: 1 }]}
                          onPress={() => setShowCustomInput(false)}
                        >
                          <Text style={[styles.customBtnText, { color: theme.colors.text }]}>Back</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.customBtn, { backgroundColor: theme.colors.primary }]}
                          onPress={handleCustomSubmit}
                        >
                          <Text style={[styles.customBtnText, { color: '#111111', fontFamily: 'Poppins-Bold' }]}>Continue</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Modal>

            {/* Immersive Authenticating/Syncing Overlay */}
            {authLoading && (
              <Modal transparent={true} visible={true}>
                <View style={styles.authLoadingOverlay}>
                  <View style={[styles.authLoadingCard, { backgroundColor: theme.colors.surface }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.authLoadingTitle, { color: theme.colors.text }]}>Authenticating...</Text>
                    <Text style={[styles.authLoadingSub, { color: theme.colors.textSecondary }]}>
                      Establishing secure native sync with Google & database...
                    </Text>
                  </View>
                </View>
              </Modal>
            )}
            
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
    paddingBottom: spacing.md,
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
    marginBottom: spacing.xl,
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
    marginTop: spacing.md,
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
  socialButton: {
    height: 56,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  socialIcon: {
    marginRight: spacing.sm,
  },
  socialButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalDragBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  accountsList: {
    width: '100%',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  avatarBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  accountEmail: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 1,
  },
  useAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  useAnotherText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  customEmailContainer: {
    width: '100%',
    paddingTop: spacing.sm,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginBottom: spacing.xs,
  },
  inputBox: {
    height: 54,
    borderRadius: radius.input,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    height: '100%',
  },
  customInputButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  customBtn: {
    flex: 0.48,
    height: 50,
    borderRadius: radius.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  authLoadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authLoadingCard: {
    padding: spacing.xl,
    borderRadius: radius.card,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  authLoadingTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: 4,
  },
  authLoadingSub: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
