import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AuthHeader } from '../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

export const ForgotPasswordScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>>();
  const [selectedMethod, setSelectedMethod] = useState<'phone' | 'email'>('phone');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Forgot Password</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Select which contact details should we use to reset your password
        </Text>

        <TouchableOpacity 
          style={[
            styles.methodCard, 
            { 
              backgroundColor: theme.colors.card,
              borderColor: selectedMethod === 'phone' ? theme.colors.primary : theme.colors.border,
              borderWidth: 1,
            }
          ]}
          onPress={() => setSelectedMethod('phone')}
        >
          <View style={[styles.iconContainer, { backgroundColor: selectedMethod === 'phone' ? '#FFF9E6' : theme.colors.background }]}>
            <Ionicons name="chatbubble-ellipses" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodLabel, { color: theme.colors.textSecondary }]}>Via SMS</Text>
            <Text style={[styles.methodValue, { color: theme.colors.text }]}>**** **** 70</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.methodCard, 
            { 
              backgroundColor: theme.colors.card,
              borderColor: selectedMethod === 'email' ? theme.colors.primary : theme.colors.border,
              borderWidth: 1,
            }
          ]}
          onPress={() => setSelectedMethod('email')}
        >
          <View style={[styles.iconContainer, { backgroundColor: selectedMethod === 'email' ? '#FFF9E6' : theme.colors.background }]}>
            <Ionicons name="mail" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodLabel, { color: theme.colors.textSecondary }]}>Via Email</Text>
            <Text style={[styles.methodValue, { color: theme.colors.text }]}>**** **** xyz@gmail.com</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footer}>
          <AppButton 
            title="Continue" 
            onPress={() => navigation.navigate('OtpVerification', {
              type: selectedMethod,
              value: selectedMethod === 'phone' ? '**** **** 70' : '**** **** xyz@gmail.com',
              nextScreen: 'SetPassword'
            })} 
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
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  methodValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xxl,
  },
});
