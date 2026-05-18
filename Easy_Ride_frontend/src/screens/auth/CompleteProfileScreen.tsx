import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Image, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withSequence,
  FadeInDown,
  FadeInUp
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateUserProfileMutation } from '../../api/user.api';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setBackendUser, setFirebaseToken, setFirebaseUser } from '../../redux/slices/authSlice';
import { FirebaseService, firebaseAuth } from '../../services/firebase.service';
import { StorageService } from '../../services/storage.service';
import { STORAGE_KEYS } from '../../constants/api.constants';
import { UserService } from '../../services/user.service';

export const CompleteProfileScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'CompleteProfile'>>();
  const dispatch = useAppDispatch();

  // Fetch logged in state from store
  const { firebaseUser, backendUser } = useAppSelector((state) => state.auth);

  // Form states with fallback to current authenticated user phone if any
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(backendUser?.phone || firebaseUser?.phoneNumber || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  
  // Realtime field validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  
  // Loading states
  const [uploadingImage, setUploadingImage] = useState(false);

  // RTK Mutation
  const [updateProfile, { isLoading: isSaving }] = useUpdateUserProfileMutation();

  // Avatar hover effect shared values
  const avatarScale = useSharedValue(1);

  useEffect(() => {
    if (backendUser) {
      setFullName(backendUser.fullName || '');
      setEmail(backendUser.email || '');
      if (backendUser.phone) setPhone(backendUser.phone);
      if (backendUser.profileImage) setAvatarUri(backendUser.profileImage);
    }
  }, [backendUser]);

  // Real-time validations
  useEffect(() => {
    if (fullName && fullName.trim().length < 3) {
      setNameError('Full name must be at least 3 characters');
    } else {
      setNameError(null);
    }
  }, [fullName]);

  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError(null);
      }
    } else {
      setEmailError(null);
    }
  }, [email]);

  const handlePickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    avatarScale.value = withSequence(
      withSpring(0.9, { damping: 8 }),
      withSpring(1, { damping: 8 })
    );

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow camera roll access to pick an avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setAvatarUri(selectedUri);
      
      // Perform direct upload sync
      try {
        setUploadingImage(true);
        console.log('[CompleteProfileScreen] Uploading profile photo to backend...');
        await UserService.uploadAvatar(selectedUri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setUploadingImage(false);
      } catch (err: any) {
        console.error('[CompleteProfileScreen] Photo upload failed:', err);
        setUploadingImage(false);
        Alert.alert('Upload Failed', 'Failed to upload profile photo to server.');
      }
    }
  };

  const handleSave = async () => {
    // Final check validations
    if (!fullName.trim() || fullName.trim().length < 3) {
      setNameError('Full name is required (min 3 chars)');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    try {
      console.log('[CompleteProfileScreen] Syncing profile with backend...');
      
      // Save details to database
      const response = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      }).unwrap();

      if (response.success && response.data) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Refresh session
        const currentFirebaseUser = firebaseAuth.currentUser;
        const freshToken = await FirebaseService.getIdToken(false);

        // Sync local storage
        await StorageService.setItem(STORAGE_KEYS.BACKEND_USER, response.data);

        // Update auth state in Redux
        if (currentFirebaseUser) {
          dispatch(setFirebaseUser(currentFirebaseUser));
        }
        dispatch(setFirebaseToken(freshToken));
        dispatch(setBackendUser(response.data as any));

        // Go to next step of onboarding - Location Permission Screen
        navigation.navigate('EnableLocation');
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (err: any) {
      console.error('[CompleteProfileScreen] Save profile failed:', err);
      Alert.alert('Sync Error', err.message || 'Failed to complete profile synchronization.');
    }
  };

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
    };
  });

  const isFormValid = fullName.trim().length >= 3 && 
                      email.trim().length > 0 && 
                      !nameError && 
                      !emailError && 
                      !uploadingImage;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={[styles.progressLabel, { color: theme.colors.primary }]}>STEP 1 OF 4</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>Create your Profile</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Set up your identity credentials to get matched with riders securely.
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Animated Profile Photo Selector */}
          <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]} entering={FadeInUp.delay(200)}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={handlePickImage} 
              style={[styles.avatarWrapper, { borderColor: theme.colors.primary }]}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surface }]}>
                  <Ionicons name="person" size={54} color={theme.colors.textSecondary} />
                </View>
              )}
              {uploadingImage && (
                <View style={styles.imageLoader}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              )}
              <View style={[styles.cameraBadge, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="camera" size={16} color="#111111" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.avatarTip, { color: theme.colors.textSecondary }]}>
              Add Profile Photo
            </Text>
          </Animated.View>

          {/* Form Fields */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <AppInput 
              label="Full Name" 
              placeholder="e.g. John Doe" 
              value={fullName}
              onChangeText={setFullName}
              error={nameError || undefined}
              leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />}
              rightIcon={
                fullName.trim().length >= 3 && !nameError ? (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                ) : null
              }
              autoCapitalize="words"
            />

            <AppInput 
              label="Email Address" 
              placeholder="e.g. john@example.com" 
              value={email}
              onChangeText={setEmail}
              error={emailError || undefined}
              leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />}
              rightIcon={
                email.trim().length > 0 && !emailError ? (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                ) : null
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <AppInput 
              label="Phone Number" 
              placeholder="Phone number" 
              value={phone}
              onChangeText={setPhone}
              error={phoneError || undefined}
              leftIcon={<Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} />}
              keyboardType="phone-pad"
              editable={false} // Verified phone from OTP is securely immutable
              containerStyle={{ opacity: 0.7 }}
            />
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title={isSaving ? 'Saving Profile...' : 'Save & Continue'} 
            onPress={handleSave} 
            loading={isSaving}
            disabled={!isFormValid || isSaving}
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
    paddingTop: spacing.lg,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
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
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    width: 106,
    height: 106,
    borderRadius: 53,
  },
  avatarPlaceholder: {
    width: 106,
    height: 106,
    borderRadius: 53,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarTip: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    marginTop: spacing.sm,
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
});
