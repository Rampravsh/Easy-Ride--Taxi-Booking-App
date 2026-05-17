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

type VehicleCategory = 'bike' | 'auto' | 'cab';

export const VehicleRegistrationScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'VehicleRegistration'>>();

  // Form State
  const [category, setCategory] = useState<VehicleCategory>('cab');
  const [model, setModel] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!model.trim()) newErrors.model = 'Vehicle model is required';
    if (!numberPlate.trim()) {
      newErrors.numberPlate = 'Number plate is required';
    } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(numberPlate.replace(/\s+/g, '').toUpperCase())) {
      // General format test for Indian plates like DL01CA1234
      newErrors.numberPlate = 'Enter a valid number plate (e.g. DL01CA1234)';
    }
    if (!color.trim()) newErrors.color = 'Vehicle color is required';
    if (!year.trim()) {
      newErrors.year = 'Vehicle year is required';
    } else {
      const yearNum = Number(year);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear) {
        newErrors.year = `Enter a valid year between 2000 and ${currentYear}`;
      }
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
      navigation.navigate('DocumentUpload');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <AuthHeader title="Vehicle Info" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Register Your Vehicle</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Choose your vehicle category and add official specifications below.
            </Text>
          </View>

          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>VEHICLE CATEGORY</Text>
          <View style={styles.categoryContainer}>
            <TouchableOpacity 
              style={[
                styles.categoryCard, 
                { backgroundColor: theme.colors.card },
                category === 'bike' && { borderColor: theme.colors.primary, borderWidth: 2 }
              ]}
              onPress={() => setCategory('bike')}
            >
              <Ionicons name="bicycle" size={32} color={category === 'bike' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>Bike</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.categoryCard, 
                { backgroundColor: theme.colors.card },
                category === 'auto' && { borderColor: theme.colors.primary, borderWidth: 2 }
              ]}
              onPress={() => setCategory('auto')}
            >
              <Ionicons name="car-sport-outline" size={32} color={category === 'auto' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>Auto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.categoryCard, 
                { backgroundColor: theme.colors.card },
                category === 'cab' && { borderColor: theme.colors.primary, borderWidth: 2 }
              ]}
              onPress={() => setCategory('cab')}
            >
              <Ionicons name="car-outline" size={32} color={category === 'cab' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>Cab</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <AppInput
              label="VEHICLE MODEL / BRAND"
              placeholder="e.g. Maruti Suzuki Swift"
              value={model}
              onChangeText={(text) => {
                setModel(text);
                if (errors.model) setErrors({ ...errors, model: '' });
              }}
              error={errors.model}
            />

            <AppInput
              label="NUMBER PLATE"
              placeholder="e.g. DL 01 CA 1234"
              autoCapitalize="characters"
              value={numberPlate}
              onChangeText={(text) => {
                setNumberPlate(text);
                if (errors.numberPlate) setErrors({ ...errors, numberPlate: '' });
              }}
              error={errors.numberPlate}
            />

            <View style={styles.row}>
              <View style={styles.rowField}>
                <AppInput
                  label="COLOR"
                  placeholder="e.g. White"
                  value={color}
                  onChangeText={(text) => {
                    setColor(text);
                    if (errors.color) setErrors({ ...errors, color: '' });
                  }}
                  error={errors.color}
                />
              </View>
              <View style={styles.rowField}>
                <AppInput
                  label="YEAR"
                  placeholder="e.g. 2022"
                  keyboardType="numeric"
                  maxLength={4}
                  value={year}
                  onChangeText={(text) => {
                    setYear(text);
                    if (errors.year) setErrors({ ...errors, year: '' });
                  }}
                  error={errors.year}
                />
              </View>
            </View>
          </View>

          <AppButton
            title="Continue to Document Upload"
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  categoryCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowField: {
    flex: 0.48,
  },
  button: {
    marginTop: 16,
  },
});
