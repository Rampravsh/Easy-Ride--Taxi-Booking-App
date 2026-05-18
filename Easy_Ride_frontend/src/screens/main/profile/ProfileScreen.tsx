import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  RefreshControl,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { 
  useGetUserProfileQuery, 
  useUpdateUserProfileMutation 
} from '../../../api/user.api';
import { UserService } from '../../../services/user.service';
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  
  // RTK Query hooks
  const { data: profileResponse, isLoading, isFetching, error, refetch } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const profile = profileResponse?.data;

  // Local Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Sync form inputs when query data updates
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  // Image Picker & Upload handler
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow gallery access to update your profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setIsUploading(true);
        const imageUri = result.assets[0].uri;
        await UserService.uploadAvatar(imageUri);
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (err: any) {
      console.error('[ProfileScreen] Photo upload failed:', err);
      Alert.alert('Upload Error', err.message || 'Failed to upload profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Profile Save action
  const handleUpdate = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }

    try {
      const payload: any = { fullName: fullName.trim() };
      
      const trimmedEmail = email.trim();
      if (trimmedEmail) {
        payload.email = trimmedEmail;
      }
      
      const trimmedPhone = phone.trim();
      if (trimmedPhone) {
        payload.phone = trimmedPhone;
      }

      const res = await updateProfile(payload).unwrap();

      if (res.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        refetch();
      }
    } catch (err: any) {
      console.error('[ProfileScreen] Update failure:', err);
      Alert.alert('Update Failed', err.message || 'Failed to update profile.');
    }
  };

  // Rendering Error Fallback State
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={80} color={theme.colors.danger} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Unable to load Profile</Text>
          <Text style={[styles.errorSubtitle, { color: theme.colors.textSecondary }]}>
            Please check your connection and try again.
          </Text>
          <AppButton 
            title="Retry" 
            style={styles.retryButton} 
            onPress={() => refetch()} 
          />
        </View>
      </SafeAreaView>
    );
  }

  // Rendering Skeleton Loaders
  if (isLoading && !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonTextMedium} />
          <View style={styles.skeletonGrid}>
            <View style={styles.skeletonGridCell} />
            <View style={styles.skeletonGridCell} />
          </View>
          <View style={styles.skeletonInput} />
          <View style={styles.skeletonInput} />
          <View style={styles.skeletonInput} />
        </View>
      </SafeAreaView>
    );
  }

  const savedAddressesCount = profile?.savedAddresses?.length || 0;
  const walletBalance = profile?.walletBalance || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.menuButton, { backgroundColor: theme.colors.primary + '33' }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
              refreshing={isFetching} 
              onRefresh={refetch} 
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* Profile Picture & Overview */}
          <View style={styles.profilePicContainer}>
            <View style={[styles.avatarWrapper, { borderColor: theme.colors.primary }]}>
              {profile?.profileImage ? (
                <Image
                  source={{ uri: profile.profileImage }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require('../../../../assets/images/user_avatar.png')}
                  style={styles.avatar}
                />
              )}
              {isUploading && (
                <View style={styles.loaderOverlay}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              )}
              <TouchableOpacity 
                style={[styles.editIcon, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                onPress={handlePickImage}
                disabled={isUploading}
              >
                <Ionicons name="camera" size={14} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {profile?.fullName || 'Anonymous'}
            </Text>
            {profile?.rating !== undefined && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color="#FFC107" />
                <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                  {profile.rating.toFixed(1)} ★ ({profile.totalRides || 0} rides)
                </Text>
              </View>
            )}
          </View>

          {/* Premium Operational Metrics Cards */}
          <View style={styles.metricsGrid}>
            {/* Wallet Balance Card */}
            <View style={[styles.metricCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.metricIconBox}>
                <Ionicons name="wallet-outline" size={24} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Wallet Balance</Text>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  ${walletBalance.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Saved Shortcuts Card */}
            <TouchableOpacity 
              style={[styles.metricCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('Address')}
            >
              <View style={styles.metricIconBox}>
                <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>Saved Places</Text>
                <Text style={[styles.metricValue, { color: theme.colors.text }]}>
                  {savedAddressesCount} Addresses
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Edit Profile Form */}
          <View style={styles.form}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profile Information</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Email Address"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Mobile Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Mobile Number"
                placeholderTextColor={theme.colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            title="Update Profile" 
            onPress={handleUpdate} 
            loading={isUpdating}
            disabled={isUpdating || isUploading}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 78, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  form: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: spacing.md,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: spacing.xl,
  },
  retryButton: {
    width: 200,
  },
  skeletonContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  skeletonHeader: {
    width: '100%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  skeletonAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  skeletonTextMedium: {
    width: 150,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  skeletonGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  skeletonGridCell: {
    flex: 1,
    height: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
  },
  skeletonInput: {
    width: '100%',
    height: 56,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: spacing.md,
  },
});
