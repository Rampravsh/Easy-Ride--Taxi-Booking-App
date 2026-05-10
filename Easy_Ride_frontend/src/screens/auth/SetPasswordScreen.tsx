import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { AuthHeader } from '../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

export const SetPasswordScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SetPassword'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SetPassword'>>();
  const { isNew } = route.params || {};

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
          rightIcon={<Ionicons name="eye-off-outline" size={20} color={theme.colors.textSecondary} />}
        />
        <AppInput 
          placeholder="Confirm Password" 
          secureTextEntry 
          rightIcon={<Ionicons name="eye-off-outline" size={20} color={theme.colors.textSecondary} />}
        />

        <Text style={[styles.hintText, { color: theme.colors.textSecondary }]}>
          At least 1 number or a special character
        </Text>

        <AppButton 
          title={isNew ? "Register" : "Save"} 
          onPress={() => {
            if (isNew) {
              navigation.navigate('CompleteProfile');
            } else {
              navigation.navigate('Congratulations', {
                title: 'Congratulations',
                message: 'Your account is ready to use. You will be redirected to the Home Page in a few seconds.',
                nextScreen: 'Main'
              });
            }
          }} 
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
