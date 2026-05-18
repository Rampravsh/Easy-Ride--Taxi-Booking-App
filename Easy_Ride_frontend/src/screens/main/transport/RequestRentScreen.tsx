import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useBookRideMutation } from '../../../api/ride.api';
import { setActiveRide } from '../../../redux/slices/rideSlice';

interface PaymentMethod {
  id: 'wallet' | 'cash' | 'card';
  name: string;
  icon: string;
  details?: string;
}

export const RequestRentScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const pickup = useSelector((state: RootState) => state.ride.pickupLocation);
  const destination = useSelector((state: RootState) => state.ride.destinationLocation);
  const rideEstimate = useSelector((state: RootState) => state.ride.rideEstimate);
  const selectedVehicle = useSelector((state: RootState) => state.ride.selectedVehicle);
  const selectedCategory = useSelector((state: RootState) => state.ride.selectedCategory);

  const [bookRide, { isLoading: isBooking }] = useBookRideMutation();

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash' | 'card'>('wallet');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'wallet', name: 'My Wallet Balance', icon: 'wallet-outline', details: '$120.50' },
    { id: 'cash', name: 'Cash Payment', icon: 'cash-outline', details: 'Pay after trip' },
    { id: 'card', name: 'Mastercard Link', icon: 'card-outline', details: '**** 5824' },
  ];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'EASY50') {
      setPromoApplied(true);
      Alert.alert('Promo Code Applied', 'You saved 10% on this ride!');
    } else {
      Alert.alert('Invalid Code', 'The promo code entered is not active or invalid.');
    }
  };

  const handleRequestRide = async () => {
    if (!pickup?.coordinates || !destination?.coordinates || !selectedVehicle || !selectedCategory) {
      Alert.alert('Booking Error', 'Missing locations or vehicle details. Please restart selection.');
      return;
    }

    try {
      // 1. Dispatch dynamic Swagger payload
      const response = await bookRide({
        pickupCoordinates: pickup.coordinates,
        dropCoordinates: destination.coordinates,
        pickupAddress: pickup.address,
        dropAddress: destination.address,
        rideType: selectedVehicle,
        rideCategory: selectedCategory,
        paymentMethod: paymentMethod,
      }).unwrap();

      if (response.success && response.data) {
        // 2. Persist active ride to Redux
        dispatch(setActiveRide(response.data));

        // 3. Clean transition to real-time Tracking panel
        navigation.navigate('RideTracking');
      } else {
        throw new Error(response.message || 'Booking rejection');
      }
    } catch (err: any) {
      console.error('[RequestRentScreen] Booking dispatch error:', err);
      const errMsg = err.data?.message || err.message || 'An error occurred while matching with a driver.';
      Alert.alert('Booking Failed', errMsg);
    }
  };

  const calculateFinalTotal = () => {
    if (!rideEstimate) return 0;
    let total = rideEstimate.totalFare;
    if (promoApplied) {
      total = total * 0.9; // 10% discount
    }
    return total;
  };

  if (!rideEstimate) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AuthHeader title="Request ride" onBack={() => navigation.goBack()} />
        <View style={styles.errorState}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            Session expired. Please reselect your ride transport class.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Request ride" onBack={() => navigation.goBack()} />

      {isBooking ? (
        <View style={styles.bookingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.matchingTitle, { color: theme.colors.text }]}>Matching with driver...</Text>
          <Text style={[styles.matchingSubtitle, { color: theme.colors.textSecondary }]}>
            Please wait while we search for active partners in your immediate coordinates.
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Location Summary Card */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="map-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Selected Route</Text>
            </View>
            
            <View style={styles.routeDetails}>
              <View style={styles.routeLine}>
                <Ionicons name="radio-button-on" size={14} color={theme.colors.primary} />
                <View style={[styles.dashLine, { backgroundColor: theme.colors.border }]} />
                <Ionicons name="location" size={14} color="#FF5252" />
              </View>
              <View style={styles.routeText}>
                <Text style={[styles.addressText, { color: theme.colors.text }]} numberOfLines={1}>
                  {pickup?.address}
                </Text>
                <Text style={[styles.addressText, { color: theme.colors.text }]} numberOfLines={1}>
                  {destination?.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Methods Selection */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Method</Text>
          <View style={styles.paymentList}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentItem,
                    { backgroundColor: theme.colors.card },
                    isSelected && { borderWidth: 1.5, borderColor: theme.colors.primary }
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <Ionicons name={method.icon as any} size={24} color={theme.colors.primary} />
                  <View style={styles.paymentDetails}>
                    <Text style={[styles.paymentName, { color: theme.colors.text }]}>{method.name}</Text>
                    {method.details && (
                      <Text style={[styles.paymentSub, { color: theme.colors.textSecondary }]}>
                        {method.details}
                      </Text>
                    )}
                  </View>
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={22}
                    color={isSelected ? theme.colors.primary : theme.colors.border}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Promo Code Entry */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Promo Code</Text>
          <View style={styles.promoContainer}>
            <View style={[styles.promoInputWrapper, { backgroundColor: theme.colors.card }]}>
              <TextInput
                style={[styles.promoInput, { color: theme.colors.text }]}
                placeholder="Enter promo code (E.g. EASY50)"
                placeholderTextColor={theme.colors.textSecondary}
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
                editable={!promoApplied}
              />
            </View>
            <AppButton
              title={promoApplied ? "Applied" : "Apply"}
              onPress={handleApplyPromo}
              style={styles.promoButton}
              disabled={promoApplied || !promoCode.trim()}
            />
          </View>

          {/* Price checkout summary */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, marginTop: spacing.lg }]}>
            <View style={styles.summaryRow}>
              <Text style={{ color: theme.colors.textSecondary }}>Computed Fare</Text>
              <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
                ${rideEstimate.totalFare.toFixed(2)}
              </Text>
            </View>
            {promoApplied && (
              <View style={styles.summaryRow}>
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Promo Discount (10%)</Text>
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                  -${(rideEstimate.totalFare * 0.1).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Charge</Text>
              <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                ${calculateFinalTotal().toFixed(2)}
              </Text>
            </View>
          </View>

        </ScrollView>
      )}

      {!isBooking && (
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <AppButton
            title={`Confirm Booking`}
            onPress={handleRequestRide}
            style={styles.actionBtn}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  routeDetails: {
    flexDirection: 'row',
  },
  routeLine: {
    alignItems: 'center',
    marginRight: spacing.md,
    paddingVertical: 4,
  },
  dashLine: {
    width: 1,
    flex: 1,
    marginVertical: 4,
  },
  routeText: {
    flex: 1,
    justifyContent: 'space-between',
    height: 48,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  paymentList: {
    gap: spacing.md,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600',
  },
  paymentSub: {
    fontSize: 12,
    marginTop: 2,
  },
  promoContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  promoInputWrapper: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  promoInput: {
    fontSize: 14,
  },
  promoButton: {
    width: 90,
    height: 48,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    opacity: 0.1,
    marginVertical: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  actionBtn: {
    width: '100%',
  },
  bookingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  matchingTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  matchingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
  },
});
