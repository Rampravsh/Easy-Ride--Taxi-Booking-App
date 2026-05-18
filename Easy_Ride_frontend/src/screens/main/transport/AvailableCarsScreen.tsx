import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { RideService } from '../../../services/ride.service';
import { setSelectedCategory, setRideEstimate } from '../../../redux/slices/rideSlice';
import { useGetRideEstimateMutation } from '../../../api/ride.api';
import { VehicleCategory } from '../../../types/ride';

export const AvailableCarsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const pickup = useSelector((state: RootState) => state.ride.pickupLocation);
  const destination = useSelector((state: RootState) => state.ride.destinationLocation);
  const rideEstimate = useSelector((state: RootState) => state.ride.rideEstimate);
  const selectedVehicle = useSelector((state: RootState) => state.ride.selectedVehicle);
  const selectedCategory = useSelector((state: RootState) => state.ride.selectedCategory);

  const [getEstimate, { isLoading: estimateLoading }] = useGetRideEstimateMutation();

  const handleRecalculateCategory = async (category: VehicleCategory) => {
    if (!pickup?.coordinates || !destination?.coordinates || !selectedVehicle) return;

    try {
      const response = await getEstimate({
        pickupCoordinates: pickup.coordinates,
        dropCoordinates: destination.coordinates,
        rideType: selectedVehicle,
        rideCategory: category,
      }).unwrap();

      if (response.success && response.data) {
        dispatch(setSelectedCategory(category));
        dispatch(setRideEstimate(response.data));
      }
    } catch (err) {
      console.error('[AvailableCarsScreen] Error switching categories:', err);
    }
  };

  if (!rideEstimate) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AuthHeader title="Available Vehicles" onBack={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={72} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Estimates Found</Text>
          <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
            Please return to the previous screen and confirm your locations to compute fare estimates.
          </Text>
          <AppButton 
            title="Go back" 
            onPress={() => navigation.goBack()} 
            style={styles.emptyButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Derive dynamic choices based on estimate and vehicle type
  const isSurge = rideEstimate.surgeMultiplier > 1.0;
  const formattedDistance = RideService.formatDistance(rideEstimate.estimatedDistance);
  const formattedDuration = RideService.formatDuration(rideEstimate.estimatedDuration);

  let vehicles: any[] = [];
  if (selectedVehicle === 'bike') {
    vehicles = [
      { id: 'bike-saver', name: 'Standard RideBike', type: 'Manual/Eco | 1 seat', distance: `350m (3 mins away)`, price: `$${rideEstimate.totalFare.toFixed(2)}`, category: 'saver' as VehicleCategory },
      { id: 'bike-premium', name: 'Premium SportBike', type: 'Octane | 1 seat', distance: `700m (4 mins away)`, price: `$${(rideEstimate.totalFare * 1.3).toFixed(2)}`, category: 'premium' as VehicleCategory }
    ];
  } else if (selectedVehicle === 'auto') {
    vehicles = [
      { id: 'auto-saver', name: 'Standard CNG Auto', type: 'CNG | 3 seats', distance: `400m (4 mins away)`, price: `$${rideEstimate.totalFare.toFixed(2)}`, category: 'saver' as VehicleCategory },
      { id: 'auto-premium', name: 'E-Auto Comfort', type: 'Electric | 3 seats', distance: `1.0km (6 mins away)`, price: `$${(rideEstimate.totalFare * 1.25).toFixed(2)}`, category: 'premium' as VehicleCategory }
    ];
  } else {
    // Cab selections mapping
    vehicles = [
      { id: 'cab-saver', name: 'EasyRide Sedan', type: 'Automatic | 4 seats | Saver class', distance: `800m (5 mins away)`, price: `$${rideEstimate.totalFare.toFixed(2)}`, category: 'saver' as VehicleCategory },
      { id: 'cab-premium', name: 'Premium Comfort SUV', type: 'Automatic | 6 seats | Premium class', distance: `1.5km (8 mins away)`, price: `$${(rideEstimate.totalFare * 1.5).toFixed(2)}`, category: 'premium' as VehicleCategory },
      { id: 'cab-luxury', name: 'Luxury Executive Cruiser', type: 'Automatic | 4 seats | Luxury class', distance: `2.4km (12 mins away)`, price: `$${(rideEstimate.totalFare * 2.2).toFixed(2)}`, category: 'luxury' as VehicleCategory }
    ];
  }

  const renderCarItem = ({ item }: { item: typeof vehicles[0] }) => {
    const isCurrentActiveCategory = selectedCategory === item.category;

    return (
      <View style={[
        styles.carCard, 
        { backgroundColor: theme.colors.card },
        isCurrentActiveCategory && { borderWidth: 1.5, borderColor: theme.colors.primary }
      ]}>
        <View style={styles.carInfo}>
          <View style={styles.textDetails}>
            <View style={styles.nameRow}>
              <Text style={[styles.carName, { color: theme.colors.text }]}>{item.name}</Text>
              {isCurrentActiveCategory && (
                <View style={[styles.activeTag, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.activeTagText}>SELECTED</Text>
                </View>
              )}
            </View>
            <Text style={[styles.carType, { color: theme.colors.textSecondary }]}>{item.type}</Text>
            <View style={styles.distanceRow}>
               <Ionicons name="location" size={14} color={theme.colors.primary} />
               <Text style={[styles.distanceText, { color: theme.colors.textSecondary }]}>{item.distance}</Text>
            </View>
            <Text style={[styles.farePrice, { color: theme.colors.text }]}>{item.price}</Text>
          </View>
          <Ionicons name={selectedVehicle === 'bike' ? "bicycle" : "car-sport"} size={64} color={theme.colors.border} />
        </View>
        <View style={styles.buttonRow}>
           <AppButton 
             title="Change tier" 
             onPress={() => handleRecalculateCategory(item.category)} 
             variant="outline" 
             style={styles.actionButton}
             textStyle={{ fontSize: 13 }}
             disabled={isCurrentActiveCategory || estimateLoading}
           />
           <AppButton 
             title="Select Class" 
             onPress={() => {
               if (!isCurrentActiveCategory) {
                 handleRecalculateCategory(item.category).then(() => {
                   navigation.navigate('CarDetails', { carId: item.id });
                 });
               } else {
                 navigation.navigate('CarDetails', { carId: item.id });
               }
             }} 
             style={styles.actionButton}
             textStyle={{ fontSize: 13 }}
             disabled={estimateLoading}
           />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Available rides" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.estimateBanner}>
          <View style={styles.routeSummary}>
            <Ionicons name="locate" size={16} color={theme.colors.primary} />
            <Text style={[styles.routeLabel, { color: theme.colors.text }]} numberOfLines={1}>
              {pickup?.address} → {destination?.address}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={[styles.metricText, { color: theme.colors.textSecondary }]}>
              Distance: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{formattedDistance}</Text>
            </Text>
            <Text style={[styles.metricText, { color: theme.colors.textSecondary }]}>
              Est. Time: <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{formattedDuration}</Text>
            </Text>
          </View>

          {isSurge && (
            <View style={styles.surgeIndicator}>
              <Ionicons name="trending-up" size={14} color="#000" />
              <Text style={styles.surgeText}>
                Surge Active: {rideEstimate.surgeMultiplier.toFixed(1)}x pricing applied due to high demand
              </Text>
            </View>
          )}
        </View>

        <FlatList
          data={vehicles}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  list: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  estimateBanner: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  routeSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeLabel: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  metricText: {
    fontSize: 12,
  },
  surgeIndicator: {
    backgroundColor: '#FFF9E6',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    gap: 6,
    marginTop: spacing.xs,
  },
  surgeText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '600',
  },
  carCard: {
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  carInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  textDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  carName: {
    fontSize: 16,
    fontWeight: '700',
  },
  activeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
  },
  carType: {
    fontSize: 12,
    marginBottom: 8,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  distanceText: {
    fontSize: 12,
  },
  farePrice: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    height: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    width: '100%',
  },
});
