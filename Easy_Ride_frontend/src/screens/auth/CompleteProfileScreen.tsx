import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { AuthHeader } from '../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateUserProfileMutation } from '../../api/user.api';

export const CompleteProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'CompleteProfile'>>();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  
  // RTK Mutation
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const handleSave = async () => {
    // Form Validations
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone Number is required.');
      return;
    }
    
    // Standard email validation regex
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Validation Error', 'Please enter a valid email address.');
        return;
      }
    }

    try {
      // Synchronize changes to MongoDB backend via PUT /users/profile
      const response = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
      }).unwrap();

      if (response.success) {
        // Optimistically navigate user to congratulations screen on database success
        navigation.navigate('Congratulations', {
          title: 'Congratulations!',
          message: 'Your account profile is complete and ready to use. You will be redirected to the Home Page in a few seconds.',
          nextScreen: 'Main'
        });
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (err: any) {
      console.error('[CompleteProfileScreen] Save profile failed:', err);
      Alert.alert('Error', err.message || 'Failed to complete profile synchronization.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Complete Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="person" size={60} color={theme.colors.border} />
            <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <AppInput 
          label="Full Name" 
          placeholder="John Doe" 
          value={fullName}
          onChangeText={setFullName}
        />
        <AppInput 
          label="Phone Number" 
          placeholder="123456789" 
          value={phone}
          onChangeText={setPhone}
          leftIcon={<Text style={{ color: theme.colors.text }}>+91</Text>}
          keyboardType="phone-pad"
        />
        <AppInput 
          label="Email Address" 
          placeholder="example@mail.com" 
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <AppInput 
          label="Street Address (Optional)" 
          placeholder="Enter Street Details" 
          value={street}
          onChangeText={setStreet}
        />
        <AppInput 
          label="City (Optional)" 
          placeholder="Enter City" 
          value={city}
          onChangeText={setCity}
        />

        <View style={styles.footer}>
          <AppButton 
            title="Cancel" 
            variant="outline" 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          />
          <AppButton 
            title="Save Profile" 
            style={styles.saveButton}
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
