import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { AuthHeader } from '../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

export const SignUpScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SignUp'>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Sign up</Text>
        
        <AppInput placeholder="Name" />
        <AppInput placeholder="Email" keyboardType="email-address" />
        <AppInput 
          placeholder="Phone Number" 
          keyboardType="phone-pad" 
          leftIcon={<Text style={{ color: theme.colors.textSecondary }}>+880</Text>}
        />
        <AppInput 
          placeholder="Gender" 
          rightIcon={<Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />}
        />

        <View style={styles.termsContainer}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            By signing up, you agree to the{' '}
            <Text style={{ color: theme.colors.primary }}>Terms of service</Text> and{' '}
            <Text style={{ color: theme.colors.primary }}>Privacy policy</Text>
          </Text>
        </View>

        <AppButton 
          title="Sign up" 
          onPress={() => navigation.navigate('OtpVerification', { 
            type: 'phone', 
            value: '+880 123456789',
            nextScreen: 'SetPassword'
          })} 
          style={styles.signUpButton}
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

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
            Already have an account?{' '}
            <Text 
              style={{ color: theme.colors.primary, fontWeight: '700' }}
              onPress={() => navigation.navigate('SignIn')}
            >
              Sign in
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  termsText: {
    fontSize: 14,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  signUpButton: {
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
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
});
