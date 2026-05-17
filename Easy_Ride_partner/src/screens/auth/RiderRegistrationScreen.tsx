import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
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

export const RiderRegistrationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'RiderRegistration'>>();

  // Form State
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    city: '',
    experience: '',
    referralCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.experience.trim()) {
      newErrors.experience = 'Driving experience is required';
    } else if (isNaN(Number(form.experience))) {
      newErrors.experience = 'Enter experience in years as a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setLoading(true);
    
    // Simulate API registration save
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('VehicleRegistration');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <AuthHeader title="Partner Profile" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Personal Details</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Help us understand your background to activate your driving partner profile.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <AppInput
              label="FULL NAME"
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChangeText={(text) => {
                setForm({ ...form, fullName: text });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              error={errors.fullName}
            />

            <AppInput
              label="EMAIL ADDRESS"
              placeholder="e.g. johndoe@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => {
                setForm({ ...form, email: text });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
            />

            <AppInput
              label="CITY OF OPERATION"
              placeholder="e.g. New Delhi"
              value={form.city}
              onChangeText={(text) => {
                setForm({ ...form, city: text });
                if (errors.city) setErrors({ ...errors, city: '' });
              }}
              error={errors.city}
            />

            <AppInput
              label="DRIVING EXPERIENCE (YEARS)"
              placeholder="e.g. 5"
              keyboardType="numeric"
              value={form.experience}
              onChangeText={(text) => {
                setForm({ ...form, experience: text });
                if (errors.experience) setErrors({ ...errors, experience: '' });
              }}
              error={errors.experience}
            />

            <AppInput
              label="REFERRAL CODE (OPTIONAL)"
              placeholder="e.g. PARTNER500"
              autoCapitalize="characters"
              value={form.referralCode}
              onChangeText={(text) => setForm({ ...form, referralCode: text })}
            />
          </View>

          <AppButton
            title="Continue to Vehicle Details"
            loading={loading}
            onPress={handleNext}
            style={styles.button}
          />
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
