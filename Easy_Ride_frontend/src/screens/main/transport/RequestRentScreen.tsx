import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useBookRideMutation } from '../../../api/ride.api';
import { setActiveRide } from '../../../redux/slices/rideSlice';

const { width } = Dimensions.get('window');

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

  // Concentric radar pulsing animation refs
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isBooking) {
      const pulseConfig = (animRef: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animRef, {
              toValue: 1,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animationSuite = Animated.parallel([
        pulseConfig(pulseAnim1, 0),
        pulseConfig(pulseAnim2, 600),
        pulseConfig(pulseAnim3, 1200),
      ]);

      animationSuite.start();
      return () => animationSuite.stop();
    } else {
      pulseAnim1.setValue(0);
      pulseAnim2.setValue(0);
      pulseAnim3.setValue(0);
    }
  }, [isBooking]);

  const PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'wallet', name: 'My Wallet Balance', icon: 'wallet-outline', details: '$120.50 Available' },
    { id: 'cash', name: 'Cash Payment', icon: 'cash-outline', details: 'Pay partner after trip' },
    { id: 'card', name: 'Premium Mastercard', icon: 'card-outline', details: '**** 5824 Link' },
  ];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'EASY50') {
      setPromoApplied(true);
      Alert.alert('Promo Code Active', 'Awesome! You saved 10% discount on this journey.');
    } else {
      Alert.alert('Invalid Code', 'The promo code entered is either inactive or invalid.');
    }
  };

  const handleRequestRide = async () => {
    if (!pickup?.coordinates || !destination?.coordinates || !selectedVehicle || !selectedCategory) {
      Alert.alert('Booking Error', 'Missing route locations or vehicle details. Please recompute selection.');
      return;
    }

    try {
      // 1. Submit dynamic Swagger compliant ride booking payload
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
        throw new Error(response.message || 'Booking submission rejected');
      }
    } catch (err: any) {
      console.error('[RequestRentScreen] Booking failure:', err);
      const errMsg = err.data?.message || err.message || 'An error occurred while matching with active partners.';
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
            Session expired. Please reselect your ride class options.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Animate pulse styles
  const getPulseStyle = (animVal: Animated.Value) => ({
    transform: [
      {
        scale: animVal.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 2.2],
        }),
      },
    ],
    opacity: animVal.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0.8, 0.4, 0],
    }),
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Confirm booking" onBack={() => navigation.goBack()} />

      {isBooking ? (
        /* Elevated Pulsing Radar Driver Searching Overlay */
        <View style={styles.bookingOverlay}>
          <View style={styles.radarContainer}>
            <Animated.View style={[styles.pulseRadar, getPulseStyle(pulseAnim1), { backgroundColor: theme.colors.primary }]} />
            <Animated.View style={[styles.pulseRadar, getPulseStyle(pulseAnim2), { backgroundColor: theme.colors.primary }]} />
            <Animated.View style={[styles.pulseRadar, getPulseStyle(pulseAnim3), { backgroundColor: theme.colors.primary }]} />
            
            <View style={[styles.centerRadarIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="car-sport" size={32} color="#000" />
            </View>
          </View>
          
          <Text style={[styles.matchingTitle, { color: theme.colors.text }]}>Searching for Partners...</Text>
          <Text style={[styles.matchingSubtitle, { color: theme.colors.textSecondary }]}>
            Scanning active driver coordinates to find the optimal match for your ride. Please wait.
          </Text>
          <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 24 }} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Location Journey Details Card */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="map-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Ride Journey</Text>
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

          {/* Payment Selection List */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Payment Option</Text>
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
                  <View style={[styles.paymentIconBox, { backgroundColor: 'rgba(0,0,0,0.02)' }]}>
                    <Ionicons name={method.icon as any} size={22} color={theme.colors.primary} />
                  </View>
                  <View style={styles.paymentDetails}>
                    <Text style={[styles.paymentName, { color: theme.colors.text }]}>{method.name}</Text>
                    {method.details && (
                      <Text style={[styles.paymentSub, { color: theme.colors.textSecondary }]}>
                        {method.details}
                      </Text>
                    )}
                  </View>
                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={isSelected ? theme.colors.primary : theme.colors.border}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Promo Code Input */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Apply Promo Code</Text>
          <View style={styles.promoContainer}>
            <View style={[styles.promoInputWrapper, { backgroundColor: theme.colors.card }]}>
              <TextInput
                style={[styles.promoInput, { color: theme.colors.text }]}
                placeholder="Enter Code (E.g. EASY50)"
                placeholderTextColor={theme.colors.textSecondary}
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
                editable={!promoApplied}
              />
            </View>
            <AppButton
              title={promoApplied ? "Active" : "Apply"}
              onPress={handleApplyPromo}
              style={styles.promoButton}
              disabled={promoApplied || !promoCode.trim()}
            />
          </View>

          {/* Checkout Breakdown summary */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, marginTop: spacing.xl }]}>
            <View style={styles.summaryRow}>
              <Text style={{ color: theme.colors.textSecondary, fontWeight: '500' }}>Journey Fare Estimate</Text>
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>
                ${rideEstimate.totalFare.toFixed(2)}
              </Text>
            </View>
            {promoApplied && (
              <View style={styles.summaryRow}>
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Promo Code Discount (10%)</Text>
                <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  -${(rideEstimate.totalFare * 0.1).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Fare Charge</Text>
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
            title={`Proceed and Dispatch`}
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
    borderRadius: 24,
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
    fontWeight: '800',
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
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
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
    borderRadius: 20,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  paymentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '700',
  },
  paymentSub: {
    fontSize: 11,
    marginTop: 2,
  },
  promoContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  promoInputWrapper: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  promoInput: {
    fontSize: 14,
    fontWeight: '600',
  },
  promoButton: {
    width: 96,
    height: 52,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    opacity: 0.08,
    marginVertical: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  actionBtn: {
    width: '100%',
    height: 52,
  },
  bookingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  radarContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pulseRadar: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  centerRadarIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  matchingTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
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
