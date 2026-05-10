import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { AuthHeader } from '../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';

export const CompleteProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'CompleteProfile'>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.card }]}>
            <Ionicons name="person" size={60} color={theme.colors.border} />
            <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <AppInput label="Full Name" placeholder="John Doe" />
        <AppInput 
          label="Phone Number" 
          placeholder="123456789" 
          leftIcon={<Text style={{ color: theme.colors.text }}>+880</Text>}
        />
        <AppInput label="Email" placeholder="example@mail.com" />
        <AppInput 
          label="Street" 
          placeholder="Select Street" 
          rightIcon={<Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />}
        />
        <AppInput 
          label="City" 
          placeholder="Select City" 
          rightIcon={<Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />}
        />
        <AppInput 
          label="District" 
          placeholder="Select District" 
          rightIcon={<Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />}
        />

        <View style={styles.footer}>
          <AppButton 
            title="Cancel" 
            variant="outline" 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          />
          <AppButton 
            title="Save" 
            style={styles.saveButton}
            onPress={() => navigation.navigate('Congratulations', {
              title: 'Congratulations',
              message: 'Your account is ready to use. You will be redirected to the Home Page in a few seconds.',
              nextScreen: 'Main'
            })}
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
