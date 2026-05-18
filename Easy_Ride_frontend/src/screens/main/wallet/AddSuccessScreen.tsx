import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { paymentService } from '../../../services/payment.service';

export const AddSuccessScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'AddSuccess'>>();
  const { amount, transactionId } = route.params || { amount: '0', transactionId: '' };

  const formattedAmount = paymentService.formatCurrency(parseFloat(amount || '0'), 'INR');

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.navigate('Wallet')}
        >
          <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.content}>
           <View style={[styles.successIconContainer, { backgroundColor: theme.colors.success + '22' }]}>
              <View style={[styles.successIcon, { backgroundColor: theme.colors.success }]}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
           </View>

           <Text style={[styles.title, { color: theme.colors.text }]}>Add Success</Text>
           <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
             Your money has been top up successfully to your wallet balance.
           </Text>

           <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>Amount Added</Text>
           <Text style={[styles.amountValue, { color: theme.colors.text }]}>{formattedAmount}</Text>

           {transactionId ? (
             <View style={styles.txContainer}>
               <Text style={[styles.txLabel, { color: theme.colors.textSecondary }]}>Transaction ID</Text>
               <Text style={[styles.txValue, { color: theme.colors.text }]}>{transactionId}</Text>
             </View>
           ) : null}

           <AppButton 
             title="Back to Wallet" 
             onPress={() => navigation.navigate('Wallet')} 
             style={styles.backHomeButton}
           />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: 20,
  },
  amountLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  txContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  txLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  txValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  backHomeButton: {
    width: '100%',
  },
});
