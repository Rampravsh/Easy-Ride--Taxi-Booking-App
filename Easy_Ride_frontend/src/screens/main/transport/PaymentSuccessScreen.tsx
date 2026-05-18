import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { paymentService } from '../../../services/payment.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export const PaymentSuccessScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'PaymentSuccess'>>();
  
  const activeRide = useSelector((state: RootState) => state.ride.activeRide);
  const { paymentMethod, amount, transactionId } = route.params || { paymentMethod: 'cash', amount: '215', transactionId: '' };

  const formattedAmount = paymentService.formatCurrency(parseFloat(amount), 'INR');
  const driverName = activeRide && typeof activeRide.rider === 'object' && activeRide.rider ? activeRide.rider.fullName : 'your driver';

  let description = `Your payment of ${formattedAmount} has been sent successfully to ${driverName}.`;
  if (paymentMethod === 'cash') {
    description = `Please pay the cash fare of ${formattedAmount} directly to ${driverName}.`;
  } else if (paymentMethod === 'wallet') {
    description = `Fare of ${formattedAmount} successfully deducted from your wallet balance.`;
  }

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.navigate('Tabs' as any)}
        >
          <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.content}>
           <View style={[styles.successIconContainer, { backgroundColor: theme.colors.success + '22' }]}>
              <View style={[styles.successIcon, { backgroundColor: theme.colors.success }]}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
           </View>

           <Text style={[styles.title, { color: theme.colors.text }]}>Payment Completed</Text>
           <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
             {description}
           </Text>

           <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>Amount</Text>
           <Text style={[styles.amountValue, { color: theme.colors.text }]}>{formattedAmount}</Text>

           {transactionId ? (
             <View style={styles.txContainer}>
               <Text style={[styles.txLabel, { color: theme.colors.textSecondary }]}>Transaction ID</Text>
               <Text style={[styles.txValue, { color: theme.colors.text }]}>{transactionId}</Text>
             </View>
           ) : null}

           <View style={[styles.divider, { borderStyle: 'dashed', borderColor: theme.colors.border }]} />

           <Text style={[styles.feedbackTitle, { color: theme.colors.text }]}>How was your trip?</Text>
           <Text style={[styles.feedbackSub, { color: theme.colors.textSecondary }]}>
             Your feedback helps us provide a premium riding experience for everyone.
           </Text>

           <AppButton 
             title="Provide Feedback" 
             onPress={() => navigation.navigate('Review')} 
             style={styles.feedbackButton}
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
  divider: {
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: spacing.xl,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackSub: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: 20,
  },
  feedbackButton: {
    width: '100%',
  },
});
