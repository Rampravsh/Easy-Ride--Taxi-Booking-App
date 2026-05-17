import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';
import { AuthHeader } from '../../components/common/AuthHeader';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { Ionicons } from '@expo/vector-icons';

export const PhoneLoginScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'PhoneLogin'>>();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (phoneNumber.trim().length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    
    // Simulate Firebase SMS trigger
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OtpVerification', {
        type: 'phone',
        value: `+91 ${phoneNumber}`,
        nextScreen: 'RiderRegistration',
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <AuthHeader onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Enter Phone Number</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              We will send you an OTP code to verify your mobile number.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <AppInput
              placeholder="98765 43210"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text.replace(/[^0-9]/g, ''));
                if (error) setError('');
              }}
              error={error}
              leftIcon={
                <View style={styles.countryPicker}>
                  <Text style={[styles.countryText, { color: theme.colors.text }]}>🇮🇳 +91</Text>
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                </View>
              }
            />
          </View>

          <AppButton 
            title="Continue" 
            loading={loading}
            onPress={handleNext}
            style={styles.button}
          />

          <View style={styles.separatorContainer}>
            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
            <Text style={[styles.separatorText, { color: theme.colors.textSecondary }]}>OR</Text>
            <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
          </View>

          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('GoogleLogin')}
          >
            <Ionicons name="logo-google" size={20} color={theme.colors.text} style={styles.socialIcon} />
            <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              By continuing, you agree to Easy Ride's{' '}
              <Text style={[styles.link, { color: theme.colors.primary }]}>Terms of Service</Text> and{' '}
              <Text style={[styles.link, { color: theme.colors.primary }]}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  countryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 20,
    marginLeft: 12,
  },
  button: {
    marginTop: 8,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    fontWeight: '600',
  },
});
