import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

import { Car, ChargeBreakdown } from '../../../types';

const MOCK_CAR: Car = {
  id: 'C1',
  name: 'Mustang Shelby GT',
  type: 'Transport',
  image: require('../../../../assets/images/red_mustang.png'),
  rating: 4.9,
  reviews: 531,
  pricePerHour: 200,
};

const MOCK_CHARGES: ChargeBreakdown = {
  baseFare: 200,
  vat: 20,
  promoDiscount: 15,
  total: 211,
};

const METHODS = [
  { id: 'visa', label: '**** **** **** 8970', type: 'Visa', expires: '12/26', icon: 'card' },
  { id: 'mastercard', label: '**** **** **** 8970', type: 'Mastercard', expires: '12/26', icon: 'card' },
  { id: 'email', label: 'mailaddress@email.com', icon: 'mail' },
  { id: 'cash', label: 'Cash', icon: 'cash' },
];

export const FinalPaymentScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedId, setSelectedId] = useState('visa');
  const car = MOCK_CAR;
  const charges = MOCK_CHARGES;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payment</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Car Card */}
        <View style={[styles.carCard, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary }]}>
          <View style={styles.carInfo}>
            <Text style={[styles.carName, { color: theme.colors.text }]}>{car.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={theme.colors.primary} />
              <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}> {car.rating} ({car.reviews} reviews)</Text>
            </View>
          </View>
          <Image 
            source={car.image}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        {/* Charge Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Charge</Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.colors.textSecondary }]}>{car.name.split(' ')[0]}/per hour</Text>
            <Text style={[styles.rowValue, { color: theme.colors.text }]}>${charges.baseFare}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.colors.textSecondary }]}>Vat (5%)</Text>
            <Text style={[styles.rowValue, { color: theme.colors.text }]}>${charges.vat}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.colors.textSecondary }]}>Promo Code</Text>
            <Text style={[styles.rowValue, { color: theme.colors.danger }]}>-${charges.promoDiscount}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: theme.colors.text }]}>${charges.total}</Text>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select payment method</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {METHODS.map((method) => (
            <TouchableOpacity 
              key={method.id} 
              style={[
                styles.methodCard, 
                { backgroundColor: theme.colors.background, borderColor: selectedId === method.id ? theme.colors.primary : theme.colors.border },
                selectedId === method.id && { backgroundColor: '#FFF9E6' }
              ]}
              onPress={() => setSelectedId(method.id)}
            >
              <View style={[styles.methodIconContainer, { backgroundColor: method.id === 'visa' ? '#1A1A1A' : method.id === 'mastercard' ? '#EB001B' : '#0070BA' }]}>
                {method.id === 'visa' ? (
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>VISA</Text>
                ) : method.id === 'mastercard' ? (
                  <Ionicons name="card" size={20} color="white" />
                ) : method.id === 'cash' ? (
                   <Ionicons name="cash" size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Ionicons name="logo-paypal" size={20} color="white" />
                )}
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{method.label}</Text>
                {method.expires && <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>Expires: {method.expires}</Text>}
              </View>
              <View style={[styles.radio, { borderColor: theme.colors.border }]}>
                {selectedId === method.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Confirm Ride" onPress={() => navigation.navigate('PaymentSuccess')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  carCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
  },
  carImage: {
    width: 100,
    height: 60,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  rowLabel: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  methodIconContainer: {
    width: 40,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  methodInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  methodSub: {
    fontSize: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
});
