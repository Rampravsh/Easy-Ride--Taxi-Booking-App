import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

export const RequestRentScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Request for rent" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Route Info */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.routeItem}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <View style={styles.routeText}>
              <Text style={[styles.routeLabel, { color: theme.colors.textSecondary }]}>Current location</Text>
              <Text style={[styles.routeValue, { color: theme.colors.text }]}>2972 Westheimer Rd. Santa Ana, Illinois 85486</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.routeItem}>
            <Ionicons name="location" size={20} color="#FF5252" />
            <View style={styles.routeText}>
              <Text style={[styles.routeLabel, { color: theme.colors.textSecondary }]}>Office</Text>
              <Text style={[styles.routeValue, { color: theme.colors.text }]}>1901 Thornridge Cir. Shiloh, Hawaii 81063</Text>
            </View>
            <Text style={[styles.distance, { color: theme.colors.textSecondary }]}>1.1km</Text>
          </View>
        </View>

        {/* Selected Car Summary */}
        <View style={[styles.carSummary, { backgroundColor: theme.colors.card }]}>
           <View style={styles.carInfo}>
             <Text style={[styles.carName, { color: theme.colors.text }]}>Mustang Shelby GT</Text>
             <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={[styles.ratingText, { color: theme.colors.text }]}>4.9 (531 reviews)</Text>
             </View>
           </View>
           <Ionicons name="car-sport" size={50} color={theme.colors.border} />
        </View>

        {/* Booking Details Inputs */}
        <View style={styles.dateTimeRow}>
          <TouchableOpacity style={[styles.dateInput, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Date</Text>
            <Text style={[styles.inputValue, { color: theme.colors.text }]}>May 27, 2023</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dateInput, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Time</Text>
            <Text style={[styles.inputValue, { color: theme.colors.text }]}>10:00 AM</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.promoContainer, { backgroundColor: theme.colors.card }]}>
          <TextInput 
            placeholder="Enter Promo Code" 
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.promoInput, { color: theme.colors.text }]}
          />
          <TouchableOpacity>
            <Ionicons name="pricetag-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Payment Preview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select payment method</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
              <Text style={{ color: theme.colors.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.paymentPreview, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('PaymentMethod')}
          >
            <View style={styles.paymentMethodInfo}>
              <Ionicons name="card" size={24} color={theme.colors.primary} />
              <View style={{ marginLeft: spacing.md }}>
                <Text style={[styles.paymentLabel, { color: theme.colors.text }]}>**** **** **** 8970</Text>
                <Text style={[styles.paymentSub, { color: theme.colors.textSecondary }]}>Expires: 12/26</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Confirm Booking" onPress={() => navigation.navigate('ThankYou')} />
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
    paddingBottom: spacing.xxl,
  },
  card: {
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  routeText: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
  },
  routeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
    marginLeft: 32,
  },
  distance: {
    fontSize: 12,
  },
  carSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dateInput: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 16,
  },
  inputLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 52,
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  promoInput: {
    flex: 1,
    fontSize: 14,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  paymentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 16,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentSub: {
    fontSize: 10,
  },
  footer: {
    padding: spacing.lg,
  },
});
