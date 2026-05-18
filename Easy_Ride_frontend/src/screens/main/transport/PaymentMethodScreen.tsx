import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setSelectedPaymentMethod } from '../../../redux/slices/paymentSlice';
import { useGetWalletQuery } from '../../../api/wallet.api';
import { paymentService } from '../../../services/payment.service';

export const PaymentMethodScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const reduxPaymentMethod = useSelector((state: RootState) => state.payment.selectedPaymentMethod);
  const [selectedId, setSelectedId] = useState<'wallet' | 'cash' | 'card'>(reduxPaymentMethod || 'wallet');

  // Fetch live wallet balance to display in the options list
  const { data: walletData, isLoading: walletLoading } = useGetWalletQuery();
  const walletBalance = walletData?.data?.balance || 0;
  const walletCurrency = walletData?.data?.currency || 'INR';

  const formattedBalance = paymentService.formatCurrency(walletBalance, walletCurrency);

  const METHODS = [
    { 
      id: 'wallet' as const, 
      label: 'My Wallet', 
      detail: `Balance: ${formattedBalance}`, 
      icon: 'wallet-outline' as const,
      color: '#4F46E5' 
    },
    { 
      id: 'card' as const, 
      label: 'Credit / Debit Card', 
      detail: 'Razorpay Secure Checkout', 
      icon: 'card-outline' as const,
      color: '#0EA5E9'
    },
    { 
      id: 'cash' as const, 
      label: 'Cash Payment', 
      detail: 'Pay rider directly at drop location', 
      icon: 'cash-outline' as const,
      color: '#10B981'
    },
  ];

  const handleConfirm = () => {
    dispatch(setSelectedPaymentMethod(selectedId));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Select payment method" onBack={() => navigation.goBack()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={[
              styles.methodCard, 
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 },
              selectedId === method.id && { borderColor: theme.colors.primary, borderWidth: 1.5 }
            ]}
            onPress={() => setSelectedId(method.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: method.color + '1A' }]}>
               <Ionicons name={method.icon} size={24} color={method.color} />
            </View>
            <View style={styles.methodInfo}>
               <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{method.label}</Text>
               <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>{method.detail}</Text>
            </View>
            <View style={[styles.radio, { borderColor: theme.colors.border }]}>
               {selectedId === method.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
            </View>
          </TouchableOpacity>
        ))}

        {selectedId === 'wallet' && walletBalance <= 0 && (
          <View style={[styles.alertContainer, { backgroundColor: theme.colors.danger + '11', borderColor: theme.colors.danger }]}>
            <Ionicons name="alert-circle" size={20} color={theme.colors.danger} />
            <Text style={[styles.alertText, { color: theme.colors.danger }]}>
              Your wallet balance is low. Please add money or select a different payment option.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Confirm Selection" onPress={handleConfirm} />
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
    paddingTop: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  methodLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  methodSub: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
});
