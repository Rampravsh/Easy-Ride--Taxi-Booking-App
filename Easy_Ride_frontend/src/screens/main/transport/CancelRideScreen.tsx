import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useCancelRideMutation } from '../../../api/ride.api';
import { resetRideWorkflow } from '../../../redux/slices/rideSlice';

const REASONS = [
  "Waiting for long time",
  "Unable to contact driver",
  "Driver denied to go to destination",
  "Driver denied to come to pickup",
  "Wrong address shown",
  "The price is not reasonable"
];

export const CancelRideScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const activeRide = useSelector((state: RootState) => state.ride.activeRide);
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();

  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [otherText, setOtherText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async () => {
    if (!activeRide?._id) {
      Alert.alert('Error', 'No active ride session detected.');
      return;
    }

    const finalReason = otherText.trim() ? `${selectedReason} - ${otherText}` : selectedReason;

    try {
      const response = await cancelRide({
        rideId: activeRide._id,
        reason: finalReason,
      }).unwrap();

      if (response.success) {
        // Clear all active booking states in Redux
        dispatch(resetRideWorkflow());
        setShowConfirmation(true);
      } else {
        throw new Error(response.message || 'Unable to cancel ride');
      }
    } catch (err: any) {
      console.error('[CancelRideScreen] Submit cancellation error:', err);
      const errMsg = err.data?.message || err.message || 'An error occurred while cancellation was processing.';
      Alert.alert('Submit Failed', errMsg);
    }
  };

  if (showConfirmation) {
    return (
      <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }]}>
        <View style={[styles.confirmCard, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              setShowConfirmation(false);
              navigation.navigate('Home' as any);
            }}
          >
            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={styles.sadIconContainer}>
             <Text style={{ fontSize: 80 }}>😥</Text>
          </View>

          <Text style={[styles.confirmTitle, { color: theme.colors.text }]}>We're so sad about your cancellation</Text>
          <Text style={[styles.confirmSub, { color: theme.colors.textSecondary }]}>
            We will continue to improve our services & satisfy you on the next trip.
          </Text>

          <AppButton 
            title="Back Home" 
            onPress={() => navigation.navigate('Home' as any)} 
            style={styles.backHomeButton}
          />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} disabled={isCancelling}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Cancel Taxi</Text>
        <View style={{ width: 60 }} />
      </View>

      {isCancelling ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Processing cancellation request on server...
          </Text>
        </View>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
              Please select the reason of cancellation.
            </Text>

            {REASONS.map((reason) => (
              <TouchableOpacity 
                key={reason} 
                style={[
                  styles.reasonCard, 
                  { borderColor: selectedReason === reason ? theme.colors.primary : theme.colors.border },
                  selectedReason === reason && { backgroundColor: 'rgba(255, 176, 32, 0.05)' }
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <View style={[
                  styles.checkbox, 
                  { borderColor: theme.colors.border },
                  selectedReason === reason && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                ]}>
                  {selectedReason === reason && <Ionicons name="checkmark" size={14} color="#000000" />}
                </View>
                <Text style={[styles.reasonText, { color: theme.colors.text }]}>{reason}</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={[styles.otherInput, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Provide additional context (Optional)..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              value={otherText}
              onChangeText={setOtherText}
            />
          </ScrollView>

          <View style={styles.footer}>
            <AppButton 
              title="Submit Cancellation" 
              onPress={handleSubmit} 
            />
          </View>
        </>
      )}
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
  sectionTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reasonText: {
    fontSize: 16,
  },
  otherInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.md,
    textAlignVertical: 'top',
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  confirmCard: {
    width: '85%',
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  sadIconContainer: {
    marginVertical: spacing.xl,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  confirmSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  backHomeButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
  },
});
