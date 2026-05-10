import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { AuthHeader } from '../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

export const SignInScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SignIn'>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Sign in</Text>
        
        <AppInput placeholder="Email or Phone Number" />
        <AppInput 
          placeholder="Enter Your Password" 
          secureTextEntry 
          rightIcon={<Ionicons name="eye-off-outline" size={20} color={theme.colors.textSecondary} />}
        />

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={{ color: theme.colors.danger, fontWeight: '600' }}>Forgot password?</Text>
        </TouchableOpacity>

        <AppButton 
          title="Sign in" 
          onPress={() => {}} // Integration logic
          style={styles.signInButton}
        />

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>or</Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={[styles.socialButton, { borderColor: theme.colors.border }]}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { borderColor: theme.colors.border }]}>
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { borderColor: theme.colors.border }]}>
            <Ionicons name="logo-apple" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpText, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
            <Text 
              style={{ color: theme.colors.primary, fontWeight: '700' }}
              onPress={() => navigation.navigate('SignUp')}
            >
              Sign Up
            </Text>
          </Text>
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
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.xxl,
    marginTop: spacing.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xxl,
  },
  signInButton: {
    marginBottom: spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
  },
});
