import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetWalletQuery } from '../../../api/wallet.api';
import { useCreateTopupOrderMutation, useVerifyTopupPaymentMutation } from '../../../api/payment.api';
import { useApplyPromoMutation } from '../../../api/promo.api';
import { setAppliedPromo, setSelectedPaymentMethod } from '../../../redux/slices/paymentSlice';
import { paymentService } from '../../../services/payment.service';
import { walletService } from '../../../services/wallet.service';

export const FinalPaymentScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  // Redux active states
  const activeRide = useSelector((state: RootState) => state.ride.activeRide);
  const reduxPaymentMethod = useSelector((state: RootState) => state.payment.selectedPaymentMethod);
  const userProfile = useSelector((state: RootState) => state.user.profile);

  // Local interaction states
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'cash' | 'card'>(reduxPaymentMethod || 'wallet');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // API mutations & queries
  const { data: walletData, refetch: refetchWallet } = useGetWalletQuery();
  const [applyPromoApi] = useApplyPromoMutation();
  const [createOrder] = useCreateTopupOrderMutation();
  const [verifyPayment] = useVerifyTopupPaymentMutation();

  const walletBalance = walletData?.data?.balance || 0;
  const walletCurrency = walletData?.data?.currency || 'INR';

  // Settle active ride fare or fallback
  const baseFare = activeRide ? activeRide.baseFare : 200;
  const taxAmount = activeRide ? activeRide.taxAmount : 20;
  const originalFare = activeRide ? activeRide.totalFare : (baseFare + taxAmount);
  const finalFare = Math.max(0, originalFare - discountAmount);

  // Sync selected method with Redux on mount
  useEffect(() => {
    if (reduxPaymentMethod) {
      setSelectedMethod(reduxPaymentMethod);
    }
  }, [reduxPaymentMethod]);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) {
      Alert.alert('Empty Coupon', 'Please enter a promo code first.');
      return;
    }

    setPromoLoading(true);
    try {
      const payload = {
        code: promoCodeInput.trim().toUpperCase(),
        rideType: activeRide?.rideType || 'cab',
        city: 'Mumbai', // Default active region
        fare: originalFare,
      };

      const response = await applyPromoApi(payload).unwrap();
      if (response.success && response.data) {
        const promoVal = response.data;
        dispatch(setAppliedPromo(promoVal));
        setDiscountAmount(promoVal.discountAmount);
        Alert.alert('Coupon Applied', `Successfully applied coupon code "${promoCodeInput.trim().toUpperCase()}". Discount of ${paymentService.formatCurrency(promoVal.discountAmount, walletCurrency)} applied!`);
      } else {
        throw new Error(response.message || 'Promo invalid.');
      }
    } catch (err: any) {
      console.error('[Promo apply error]', err);
      Alert.alert('Invalid Coupon', err?.message || err?.data?.message || 'This coupon code is invalid or has expired.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      if (selectedMethod === 'wallet') {
        // Validate sufficient wallet balance
        if (walletBalance < finalFare) {
          Alert.alert(
            'Insufficient Balance',
            `Your wallet balance (${paymentService.formatCurrency(walletBalance, walletCurrency)}) is insufficient for this fare. Please top up your wallet.`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Top Up Now', onPress: () => navigation.navigate('AddAmount') }
            ]
          );
          setPaymentLoading(false);
          return;
        }

        // Simulating immediate wallet deduction transaction successfully
        setTimeout(async () => {
          await refetchWallet();
          setPaymentLoading(false);
          navigation.navigate('PaymentSuccess', { 
            paymentMethod: 'wallet', 
            amount: String(finalFare),
            transactionId: `tx_wal_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          });
        }, 1500);

      } else if (selectedMethod === 'card') {
        // Settle transaction via Razorpay gateway
        const orderResponse = await createOrder({ amount: finalFare }).unwrap();
        if (!orderResponse.success || !orderResponse.data) {
          throw new Error(orderResponse.message || 'Payment Order generation failed.');
        }

        const order = orderResponse.data;
        const verifyPayload = await paymentService.executeRazorpayPayment(
          order,
          userProfile?.email || 'customer@easyride.com',
          userProfile?.phone || '+919999999999'
        );

        const verifyResponse = await verifyPayment(verifyPayload).unwrap();
        if (!verifyResponse.success || !verifyResponse.data) {
          throw new Error(verifyResponse.message || 'Verification failure.');
        }

        setPaymentLoading(false);
        navigation.navigate('PaymentSuccess', { 
          paymentMethod: 'card', 
          amount: String(finalFare),
          transactionId: verifyResponse.data.transaction._id
        });

      } else {
        // Settle payment method as Cash
        setPaymentLoading(false);
        navigation.navigate('PaymentSuccess', { 
          paymentMethod: 'cash', 
          amount: String(finalFare),
          transactionId: 'CASH_RECEIVED_DRIVER' 
        });
      }
    } catch (err: any) {
      console.error('[Payment Process Error]', err);
      Alert.alert('Payment Error', err?.message || err?.data?.message || 'Unable to process payment transaction.');
      setPaymentLoading(false);
    }
  };

  const formattedBase = paymentService.formatCurrency(baseFare, walletCurrency);
  const formattedTax = paymentService.formatCurrency(taxAmount, walletCurrency);
  const formattedDiscount = paymentService.formatCurrency(discountAmount, walletCurrency);
  const formattedTotal = paymentService.formatCurrency(finalFare, walletCurrency);

  const METHODS = [
    { 
      id: 'wallet' as const, 
      label: 'My Wallet', 
      detail: `Balance: ${paymentService.formatCurrency(walletBalance, walletCurrency)}`, 
      icon: 'wallet-outline' as const,
      color: '#4F46E5' 
    },
    { 
      id: 'card' as const, 
      label: 'Credit / Debit Card (Razorpay)', 
      detail: 'Secure Razorpay Transaction', 
      icon: 'card-outline' as const,
      color: '#0EA5E9'
    },
    { 
      id: 'cash' as const, 
      label: 'Cash Payment', 
      detail: 'Pay cash to driver', 
      icon: 'cash-outline' as const,
      color: '#10B981'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Payment Summary</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Ride Information Card */}
        <View style={[styles.carCard, { backgroundColor: '#FFF9E6', borderColor: theme.colors.primary }]}>
          <View style={styles.carInfo}>
            <Text style={[styles.carName, { color: theme.colors.text }]}>
              {activeRide ? `${activeRide.rideType.toUpperCase()} Ride` : 'Premium Sedan Ride'}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={theme.colors.primary} />
              <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                {activeRide ? ` OTP: ${activeRide.otp}` : ' Active ride completed'}
              </Text>
            </View>
          </View>
          <Ionicons name="car-sport" size={60} color={theme.colors.primary} />
        </View>

        {/* Promo Code Application Field */}
        <View style={styles.promoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Apply Promo / Coupon</Text>
          <View style={styles.promoInputRow}>
            <TextInput
              style={[styles.promoInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="ENTER PROMO CODE (e.g. EASY50)"
              placeholderTextColor={theme.colors.textSecondary}
              value={promoCodeInput}
              onChangeText={setPromoCodeInput}
              autoCapitalize="characters"
              editable={!promoLoading && !paymentLoading}
            />
            <TouchableOpacity 
              style={[styles.promoButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleApplyPromo}
              disabled={promoLoading || paymentLoading}
            >
              {promoLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.promoButtonText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Charge Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Fare Charges</Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.colors.textSecondary }]}>Base Fare</Text>
            <Text style={[styles.rowValue, { color: theme.colors.text }]}>{formattedBase}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.colors.textSecondary }]}>Vat (5%)</Text>
            <Text style={[styles.rowValue, { color: theme.colors.text }]}>{formattedTax}</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.colors.danger }]}>Promo Discount</Text>
              <Text style={[styles.rowValue, { color: theme.colors.danger }]}>-{formattedDiscount}</Text>
            </View>
          )}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: theme.colors.text }]}>{formattedTotal}</Text>
          </View>
        </View>

        {/* Payment Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Settle Method</Text>

          {METHODS.map((method) => (
            <TouchableOpacity 
              key={method.id} 
              style={[
                styles.methodCard, 
                { backgroundColor: theme.colors.background, borderColor: selectedMethod === method.id ? theme.colors.primary : theme.colors.border },
                selectedMethod === method.id && { backgroundColor: '#FFF9E6' }
              ]}
              onPress={() => {
                setSelectedMethod(method.id);
                dispatch(setSelectedPaymentMethod(method.id));
              }}
              disabled={paymentLoading}
            >
              <View style={[styles.methodIconContainer, { backgroundColor: method.color + '1A' }]}>
                <Ionicons name={method.icon} size={20} color={method.color} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{method.label}</Text>
                <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>{method.detail}</Text>
              </View>
              <View style={[styles.radio, { borderColor: theme.colors.border }]}>
                {selectedMethod === method.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {paymentLoading ? (
          <View style={styles.paymentLoadingRow}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.paymentLoadingText, { color: theme.colors.textSecondary }]}>Settle payment processing...</Text>
          </View>
        ) : (
          <AppButton 
            title={selectedMethod === 'wallet' ? 'Pay with Wallet' : selectedMethod === 'card' ? 'Pay with Razorpay' : 'Confirm Cash Ride'} 
            onPress={handlePayment} 
          />
        )}
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
  promoSection: {
    marginBottom: spacing.xl,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  promoInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 14,
  },
  promoButton: {
    width: 80,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
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
    fontSize: 11,
    marginTop: 1,
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
  paymentLoadingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  paymentLoadingText: {
    marginLeft: spacing.sm,
    fontSize: 15,
    fontWeight: '500',
  },
});
