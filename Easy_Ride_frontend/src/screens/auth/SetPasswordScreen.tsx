import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { AuthHeader } from '../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';

export const SetPasswordScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SetPassword'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SetPassword'>>();
  const { isNew, signUpData } = (route.params || {}) as any;

  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterOrSave = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please enter and confirm your password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    if (isNew) {
      if (!signUpData || !signUpData.email) {
        Alert.alert('Error', 'Registration data is missing. Please start signup from the beginning.');
        return;
      }

      setLoading(true);
      try {
        // 1. Create a Firebase authentication credential
        const firebaseUser = await FirebaseService.signUpWithEmailAndPassword(signUpData.email, password);

        // 2. Fetch JWT auth ID Token
        const token = await firebaseUser.getIdToken(true);
        if (!token) {
          throw new Error('Failed to acquire secure token from Firebase.');
        }

        // 3. Synchronize with Backend (creates user record in DB and saves token in Storage)
        await AuthService.syncBackendAuth(token, 'user');

        // 4. Navigate to CompleteProfile to finalize user details
        navigation.navigate('CompleteProfile', { signUpData } as any);
      } catch (error: any) {
        console.error('[SetPasswordScreen] Registration flow failed:', error);
        Alert.alert('Registration Failed', error.message || 'Unable to create account. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Mock flow for forgot-password reset
      navigation.navigate('Congratulations', {
        title: 'Congratulations',
        message: 'Your account is ready to use. You will be redirected to the Home Page in a few seconds.',
        nextScreen: 'Main'
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {isNew ? 'Set password' : 'Set New password'}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Set your password
        </Text>

        <AppInput 
          placeholder="Enter Your Password" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
          rightIcon={<Ionicons name="eye-off-outline" size={20} color={theme.colors.textSecondary} />}
        />
        <AppInput 
          placeholder="Confirm Password" 
          secureTextEntry 
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          rightIcon={<Ionicons name="eye-off-outline" size={20} color={theme.colors.textSecondary} />}
        />

        <Text style={[styles.hintText, { color: theme.colors.textSecondary }]}>
          At least 6 characters (Firebase restriction)
        </Text>

        <AppButton 
          title={isNew ? "Register" : "Save"} 
          onPress={handleRegisterOrSave} 
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
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
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  hintText: {
    fontSize: 14,
    marginBottom: spacing.xxxl,
  },
  button: {
    marginTop: spacing.xl,
  },
});
