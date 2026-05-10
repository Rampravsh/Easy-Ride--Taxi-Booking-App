import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography, radius } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AuthHeader } from '../../components/AuthHeader';

export const OtpVerificationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'OtpVerification'>>();
  const { type, value, nextScreen } = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '']);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // Logic to move focus would go here in a full implementation
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {type === 'phone' ? 'Phone verification' : 'Email verification'}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Enter your OTP code sent to {value}
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View 
              key={index} 
              style={[
                styles.otpBox, 
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: digit ? theme.colors.primary : theme.colors.border,
                  borderWidth: 1,
                }
              ]}
            >
              <TextInput
                style={[styles.otpInput, { color: theme.colors.text }]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
            Didn't receive code? <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Resend again</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <AppButton 
            title="Verify" 
            onPress={() => navigation.navigate(nextScreen as any, { isNew: true })} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xxl,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: radius.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
  resendContainer: {
    marginTop: spacing.md,
  },
  resendText: {
    fontSize: 14,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: spacing.xxl,
  },
});
