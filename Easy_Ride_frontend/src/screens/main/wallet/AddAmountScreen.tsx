import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

const METHODS = [
  { id: 'visa', label: '**** **** **** 8970', type: 'Visa', expires: '12/26', icon: 'card' },
  { id: 'mastercard', label: '**** **** **** 8970', type: 'Mastercard', expires: '12/26', icon: 'card' },
  { id: 'email', label: 'mailaddress@email.com', icon: 'mail' },
  { id: 'cash', label: 'Cash', icon: 'cash' },
];

export const AddAmountScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('visa');

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
          placeholder="Enter Amount"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={styles.sectionHeader}>
           <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Payment Method</Text>
           <TouchableOpacity onPress={() => navigation.navigate('AddCard')}>
             <Text style={[styles.addMethod, { color: theme.colors.primary }]}>Add payment Method</Text>
           </TouchableOpacity>
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
          >
            <View style={[styles.methodIconContainer, { backgroundColor: method.id === 'visa' ? '#1A1A1A' : method.id === 'mastercard' ? '#EB001B' : method.id === 'cash' ? '#717171' : '#0070BA' }]}>
              {method.id === 'visa' ? (
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>VISA</Text>
              ) : method.id === 'mastercard' ? (
                <Ionicons name="card" size={20} color="white" />
              ) : (
                <Ionicons name={method.icon as any} size={20} color="white" />
              )}
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodLabel, { color: theme.colors.text }]}>{method.label}</Text>
              {method.expires && <Text style={[styles.methodSub, { color: theme.colors.textSecondary }]}>Expires: {method.expires}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton 
          title="Confirm" 
          onPress={() => navigation.navigate('AddSuccess', { amount })} 
        />
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
  addMethod: {
    fontSize: 12,
    fontWeight: '600',
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
});
