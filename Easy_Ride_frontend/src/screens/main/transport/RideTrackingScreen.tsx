import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetRideDetailsQuery } from '../../../api/ride.api';
import { setActiveRide, resetRideWorkflow } from '../../../redux/slices/rideSlice';
import { RideService } from '../../../services/ride.service';

const { width, height } = Dimensions.get('window');

export const RideTrackingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  // Get active ride reference from Redux
  const activeRide = useSelector((state: RootState) => state.ride.activeRide);

  // Poll ride details dynamically every 3 seconds using built-in RTK Query polling
  const { data: response, error, isLoading, refetch } = useGetRideDetailsQuery(
    activeRide?._id || '',
    {
      skip: !activeRide?._id,
      pollingInterval: 3000, // Poll every 3 seconds for real-time tracking updates
    }
  );

  // Sync active ride back to redux store when fetched details change
  useEffect(() => {
    if (response?.data) {
      dispatch(setActiveRide(response.data));
    }
  }, [response, dispatch]);

  if (!activeRide) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="car-outline" size={72} color={theme.colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>No Active Ride Found</Text>
          <Text style={[styles.errorSubtitle, { color: theme.colors.textSecondary }]}>
            You do not have any active ride request being tracked.
          </Text>
          <AppButton 
            title="Go to Home" 
            onPress={() => {
              dispatch(resetRideWorkflow());
              navigation.navigate('Home' as any);
            }} 
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const rawRide = response?.data || activeRide;

  // Adapter mapping from backend model to legacy UI expected fields
  const uiRide = RideService.transformRideForUI(rawRide);
  const driver = uiRide.driver;
  const car = uiRide.car;
  const statusLabel = RideService.getStatusLabel(rawRide.status);
  const progress = RideService.getStatusProgress(rawRide.status);

  const handleReturnHome = () => {
    dispatch(resetRideWorkflow());
    navigation.navigate('Home' as any);
  };

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <Image 
        source={require('../../../../assets/images/map_placeholder.png')}
        style={styles.map}
        resizeMode="cover"
      />

      {/* Header Buttons */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Home' as any)}
        >
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.otpBadge}>
          <Text style={styles.otpLabel}>OTP CODE</Text>
          <Text style={styles.otpValue}>{uiRide.otp}</Text>
        </View>
      </SafeAreaView>

      {/* Car on Map - Progress-based Visual Indicator */}
      <View style={[styles.carMarkerContainer, { top: height * (0.45 - progress * 0.25) }]}>
         <View style={[styles.routeLine, { backgroundColor: theme.colors.primary, height: 100 * (1 - progress) }]} />
         <Ionicons name="car" size={32} color={theme.colors.primary} style={styles.carIcon} />
      </View>

      {/* Bottom Tracking Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.colors.background }]}>
        <View style={styles.handle} />
        
        {/* Polling Indicator */}
        <View style={styles.statusHeaderRow}>
          <View style={styles.statusIndicatorRow}>
            <View style={[styles.pulseCircle, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              {statusLabel}
            </Text>
          </View>
          {isLoading && <ActivityIndicator size="small" color={theme.colors.primary} />}
        </View>

        <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>
          Estimated Duration: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{uiRide.duration}</Text>
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Driver Details */}
        <View style={styles.driverInfo}>
          <Image 
            source={driver.avatar}
            style={styles.driverAvatar}
          />
          <View style={styles.driverDetails}>
            <Text style={[styles.driverName, { color: theme.colors.text }]}>{driver.name}</Text>
            <View style={styles.driverStats}>
               <Ionicons name="navigate-outline" size={12} color={theme.colors.textSecondary} />
               <Text style={[styles.driverSubText, { color: theme.colors.textSecondary }]}>
                 {car.name} ({car.numberPlate})
               </Text>
            </View>
            <View style={styles.driverStats}>
               <Ionicons name="star" size={12} color={theme.colors.primary} />
               <Text style={[styles.driverSubText, { color: theme.colors.textSecondary }]}>
                 {driver.rating} ({driver.totalReviews} trips)
               </Text>
            </View>
          </View>
          <Image 
            source={car.image}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Payment Summary */}
        <View style={styles.paymentSection}>
          <Text style={[styles.paymentTitle, { color: theme.colors.textSecondary }]}>Payment method ({uiRide.paymentMethod.type})</Text>
          <Text style={[styles.paymentValue, { color: theme.colors.text }]}>${uiRide.charges.total.toFixed(2)}</Text>
        </View>

        <View style={[styles.paymentCard, { backgroundColor: 'rgba(0,0,0,0.02)', borderColor: theme.colors.border, borderWidth: 1 }]}>
          <Ionicons name="wallet-outline" size={20} color={theme.colors.primary} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardLabel, { color: theme.colors.text }]}>{uiRide.paymentMethod.label}</Text>
          </View>
        </View>

        {/* Dynamic Action Overlays based on state termination */}
        {rawRide.status === 'completed' || rawRide.status === 'cancelled' ? (
          <View style={styles.terminationBanner}>
            <Ionicons 
              name={rawRide.status === 'completed' ? "checkmark-circle" : "close-circle"} 
              size={36} 
              color={rawRide.status === 'completed' ? theme.colors.primary : "#FF5252"} 
            />
            <Text style={[styles.terminationText, { color: theme.colors.text }]}>
              {rawRide.status === 'completed' 
                ? 'Your ride has concluded safely. Thank you for booking!' 
                : `Ride cancelled. Reason: ${rawRide.cancellationReason || 'User Request'}`}
            </Text>
            <AppButton 
              title="Return to Home" 
              onPress={handleReturnHome}
              style={styles.terminationBtn}
            />
          </View>
        ) : (
          <View style={styles.footerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: theme.colors.primary, borderWidth: 1.5 }]}
              onPress={() => {
                if (driver.phone) {
                  Alert.alert('Calling Driver', `Dialing partner at ${driver.phone}`);
                } else {
                  Alert.alert('Calling Driver', 'Connecting to partner voice network...');
                }
              }}
            >
              <Ionicons name="call" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: theme.colors.primary, borderWidth: 1.5 }]}
              onPress={() => navigation.navigate('Chat' as any)}
            >
              <Ionicons name="chatbubble" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {rawRide.status === 'searching' || rawRide.status === 'accepted' ? (
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('CancelRide')}
              >
                <Text style={styles.cancelButtonText}>Cancel Ride</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ongoingBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#000" />
                <Text style={styles.ongoingText}>SECURE RIDE ACTIVE</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.5,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  otpBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
  },
  otpLabel: {
    color: '#9CA3AF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  otpValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  carMarkerContainer: {
    position: 'absolute',
    left: width * 0.45,
    alignItems: 'center',
  },
  routeLine: {
    width: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  carIcon: {
    marginTop: -10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 35,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handle: {
    width: 50,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 17,
    fontWeight: '800',
  },
  durationText: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    opacity: 0.08,
    marginVertical: spacing.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  driverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  driverSubText: {
    fontSize: 11,
  },
  carImage: {
    width: 70,
    height: 50,
  },
  paymentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  paymentTitle: {
    fontSize: 13,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  ongoingBadge: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  ongoingText: {
    color: '#137333',
    fontSize: 13,
    fontWeight: '800',
  },
  terminationBanner: {
    alignItems: 'center',
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  terminationText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  terminationBtn: {
    width: '100%',
    height: 48,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  errorButton: {
    width: '100%',
  },
});
