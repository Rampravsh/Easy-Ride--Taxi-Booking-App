import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';

export const PaymentSuccessScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

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

           <Text style={[styles.title, { color: theme.colors.text }]}>Payment Success</Text>
           <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
             Your money has been successfully sent to Sergio Ramasis
           </Text>

           <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>Amount</Text>
           <Text style={[styles.amountValue, { color: theme.colors.text }]}>$215</Text>

           <View style={[styles.divider, { borderStyle: 'dashed', borderColor: theme.colors.border }]} />

           <Text style={[styles.feedbackTitle, { color: theme.colors.text }]}>How is your trip?</Text>
           <Text style={[styles.feedbackSub, { color: theme.colors.textSecondary }]}>
             Your feedback will help us to improve your driving experience better
           </Text>

           <AppButton 
             title="Please Feedback" 
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
    marginBottom: spacing.xl,
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
