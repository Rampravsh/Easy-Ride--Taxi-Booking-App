import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useCreateTopupOrderMutation, useVerifyTopupPaymentMutation } from '../../../api/payment.api';
import { paymentService } from '../../../services/payment.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const METHODS = [
  { id: 'razorpay', label: 'Razorpay Instant Checkout', icon: 'card', sub: 'Cards, UPI, Netbanking' },
];

export const AddAmountScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const [createOrder] = useCreateTopupOrderMutation();
  const [verifyPayment] = useVerifyTopupPaymentMutation();

  const userProfile = useSelector((state: RootState) => state.user.profile);

  const handleConfirm = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Razorpay order on backend
      const orderResponse = await createOrder({ amount: numAmount }).unwrap();
      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Order creation failed.');
      }

      // 2. Launch Razorpay payment flow
      const order = orderResponse.data;
      const verificationPayload = await paymentService.executeRazorpayPayment(
        order,
        userProfile?.email || 'customer@easyride.com',
        userProfile?.phone || '+919999999999'
      );

      // 3. Verify Razorpay credentials with backend
      const verifyResponse = await verifyPayment(verificationPayload).unwrap();
      if (!verifyResponse.success || !verifyResponse.data) {
        throw new Error(verifyResponse.message || 'Payment verification failed.');
      }

      // 4. On verification success, navigate to AddSuccess screen
      navigation.navigate('AddSuccess', { 
        amount: String(numAmount),
        transactionId: verifyResponse.data.transaction._id 
      });
    } catch (error: any) {
      console.error('[AddAmountScreen] payment process error:', error);
      Alert.alert('Payment Failed', error?.message || error?.data?.message || 'Something went wrong during payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Amount</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={[styles.amountInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Enter Amount (INR)"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          editable={!loading}
        />

        <View style={styles.sectionHeader}>
           <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Payment Method</Text>
        </View>

        {METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={[
              styles.methodCard, 
              { backgroundColor: theme.colors.background, borderColor: selectedMethod === method.id ? theme.colors.primary : theme.colors.border },
              selectedMethod === method.id && { backgroundColor: '#FFF9E6' }
            ]}
            onPress={() => setSelectedMethod(method.id)}
            disabled={loading}
          >
            <View style={[styles.methodIconContainer, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name={method.icon as any} size={20} color="white" />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{method.label}</Text>
              <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>{method.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Processing payment...</Text>
          </View>
        ) : (
          <AppButton 
            title="Confirm & Pay" 
            onPress={handleConfirm} 
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
  amountInput: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    fontSize: 16,
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
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  methodIconContainer: {
    width: 44,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  methodSub: {
    fontSize: 12,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontSize: 15,
    fontWeight: '500',
  },
});
