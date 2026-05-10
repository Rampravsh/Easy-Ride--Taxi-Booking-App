import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const METHODS = [
  { id: 'visa', label: '**** **** **** 8970', type: 'Visa', expires: '12/26', icon: 'card' },
  { id: 'mastercard', label: '**** **** **** 8970', type: 'Mastercard', expires: '12/26', icon: 'card' },
  { id: 'wallet', label: 'My Wallet', balance: '$250', icon: 'wallet' },
  { id: 'cash', label: 'Cash', icon: 'cash' },
  { id: 'email', label: 'mailaddress@email.com', icon: 'mail' },
  { id: 'google', label: 'Google Pay', icon: 'logo-google' },
  { id: 'phonepay', label: 'Phone Pay', icon: 'phone-portrait' },
];

export const PaymentMethodScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedId, setSelectedId] = useState('visa');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Select payment method" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {METHODS.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={[
              styles.methodCard, 
              { backgroundColor: theme.colors.card },
              selectedId === method.id && { borderColor: theme.colors.primary, borderWidth: 1 }
            ]}
            onPress={() => setSelectedId(method.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '1A' }]}>
               <Ionicons name={method.icon as any} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.methodInfo}>
               <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{method.label}</Text>
               {method.expires && <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>Expires: {method.expires}</Text>}
               {method.balance && <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>Balance: {method.balance}</Text>}
            </View>
            <View style={[styles.radio, { borderColor: theme.colors.border }]}>
               {selectedId === method.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Confirm Ride" onPress={() => navigation.goBack()} />
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
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
});
