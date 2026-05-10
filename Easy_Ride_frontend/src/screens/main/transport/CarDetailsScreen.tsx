import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const { width } = Dimensions.get('window');

const SPECS = [
  { icon: 'speedometer-outline', label: 'Max power', value: '320hp' },
  { icon: 'leaf-outline', label: 'Fuel', value: 'Octane' },
  { icon: 'flash-outline', label: 'Max speed', value: '250km' },
  { icon: 'time-outline', label: '0-60mph', value: '4.5sec' },
];

const FEATURES = [
  { label: 'Model', value: 'BM5000' },
  { label: 'Capacity', value: '760hp' },
  { label: 'Color', value: 'Red' },
  { label: 'Fuel type', value: 'Octane' },
  { label: 'Gear type', value: 'Automatic' },
];

export const CarDetailsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Mustang Shelby GT" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.ratingRow}>
           <Ionicons name="star" size={16} color="#FFD700" />
           <Text style={[styles.ratingText, { color: theme.colors.text }]}>4.9 (531 reviews)</Text>
        </View>

        <View style={styles.imageContainer}>
           <Ionicons name="car-sport" size={200} color={theme.colors.border} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Specifications</Text>
          <View style={styles.specsGrid}>
            {SPECS.map((spec, index) => (
              <View key={index} style={[styles.specCard, { backgroundColor: theme.colors.card }]}>
                <Ionicons name={spec.icon as any} size={24} color={theme.colors.primary} />
                <Text style={[styles.specValue, { color: theme.colors.text }]}>{spec.value}</Text>
                <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>{spec.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Car features</Text>
          {FEATURES.map((feature, index) => (
            <View key={index} style={[styles.featureRow, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.featureLabel, { color: theme.colors.textSecondary }]}>{feature.label}</Text>
              <Text style={[styles.featureValue, { color: theme.colors.text }]}>{feature.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
         <AppButton 
           title="Book later" 
           onPress={() => {}} 
           variant="outline" 
           style={styles.footerButton}
         />
         <AppButton 
           title="Ride Now" 
           onPress={() => navigation.navigate('RequestRent', { carId: '1' })} 
           style={styles.footerButton}
         />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.lg,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  specCard: {
    width: (width - spacing.lg * 2 - spacing.md * 3) / 4,
    aspectRatio: 0.8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  specLabel: {
    fontSize: 10,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  featureLabel: {
    fontSize: 14,
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
});
