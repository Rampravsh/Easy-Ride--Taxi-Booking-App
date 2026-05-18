import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { RideService } from '../../../services/ride.service';

export const CarDetailsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const rideEstimate = useSelector((state: RootState) => state.ride.rideEstimate);
  const selectedVehicle = useSelector((state: RootState) => state.ride.selectedVehicle);
  const selectedCategory = useSelector((state: RootState) => state.ride.selectedCategory);

  if (!rideEstimate || !selectedVehicle) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AuthHeader title="Ride Details" onBack={() => navigation.goBack()} />
        <View style={styles.errorState}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            No ride selection active. Please recalculate your fare.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Derive dynamic vehicle specifications
  const getSpecs = () => {
    switch (selectedVehicle) {
      case 'bike':
        return {
          name: selectedCategory === 'premium' ? 'Premium SportBike' : 'Standard RideBike',
          passengers: 1,
          fuelType: 'Octane',
          maxSpeed: '120 km/h',
          power: '15 HP',
          extra: 'Helmet included',
        };
      case 'auto':
        return {
          name: selectedCategory === 'premium' ? 'E-Auto Comfort' : 'Standard CNG Auto',
          passengers: 3,
          fuelType: 'CNG / Electric',
          maxSpeed: '60 km/h',
          power: '9 HP',
          extra: 'Rain Cover',
        };
      case 'cab':
      default:
        if (selectedCategory === 'luxury') {
          return {
            name: 'Luxury Executive Cruiser',
            passengers: 4,
            fuelType: 'Electric/Premium',
            maxSpeed: '220 km/h',
            power: '320 HP',
            extra: 'Air Conditioning & Music',
          };
        } else if (selectedCategory === 'premium') {
          return {
            name: 'Premium Comfort SUV',
            passengers: 6,
            fuelType: 'Diesel',
            maxSpeed: '180 km/h',
            power: '180 HP',
            extra: 'Spacious Cabin',
          };
        } else {
          return {
            name: 'EasyRide Sedan',
            passengers: 4,
            fuelType: 'Petrol',
            maxSpeed: '150 km/h',
            power: '105 HP',
            extra: 'Standard Compact',
          };
        }
    }
  };

  const specs = getSpecs();
  const hasSurge = rideEstimate.surgeMultiplier > 1.0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Ride details" onBack={() => navigation.goBack()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={
              selectedVehicle === 'bike'
                ? require('../../../../assets/images/driver_sergio.png') // generic placeholder representing motorbike or driver
                : require('../../../../assets/images/red_mustang.png')
            } 
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsHeader}>
          <Text style={[styles.vehicleName, { color: theme.colors.text }]}>{specs.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFB020" />
            <Text style={[styles.rating, { color: theme.colors.text }]}>4.9</Text>
            <Text style={[styles.reviews, { color: theme.colors.textSecondary }]}>(120 reviews)</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Specifications</Text>
        <View style={styles.specsGrid}>
          <View style={[styles.specCard, { backgroundColor: theme.colors.card }]}>
            <MaterialCommunityIcons name="speedometer" size={24} color={theme.colors.primary} />
            <Text style={[styles.specValue, { color: theme.colors.text }]}>{specs.maxSpeed}</Text>
            <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>Max speed</Text>
          </View>

          <View style={[styles.specCard, { backgroundColor: theme.colors.card }]}>
            <MaterialCommunityIcons name="gas-station" size={24} color={theme.colors.primary} />
            <Text style={[styles.specValue, { color: theme.colors.text }]}>{specs.fuelType}</Text>
            <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>Fuel type</Text>
          </View>

          <View style={[styles.specCard, { backgroundColor: theme.colors.card }]}>
            <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
            <Text style={[styles.specValue, { color: theme.colors.text }]}>{specs.passengers} seats</Text>
            <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>Max capacity</Text>
          </View>

          <View style={[styles.specCard, { backgroundColor: theme.colors.card }]}>
            <MaterialCommunityIcons name="engine" size={24} color={theme.colors.primary} />
            <Text style={[styles.specValue, { color: theme.colors.text }]}>{specs.power}</Text>
            <Text style={[styles.specLabel, { color: theme.colors.textSecondary }]}>Max power</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Fare Breakdown</Text>
        <View style={[styles.breakdownCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: theme.colors.textSecondary }]}>Base Distance Fare</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>${rideEstimate.baseFare.toFixed(2)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: theme.colors.textSecondary }]}>Taxes & Government Levies</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>${rideEstimate.taxAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: theme.colors.textSecondary }]}>Surge Multiplier</Text>
            <Text style={[styles.breakdownValue, { color: hasSurge ? '#FF5252' : theme.colors.text }]}>
              {rideEstimate.surgeMultiplier.toFixed(1)}x
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.breakdownRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Fare</Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
              ${rideEstimate.totalFare.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.extraBanner}>
          <Ionicons name="information-circle-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.extraText, { color: theme.colors.textSecondary }]}>
            Feature note: {specs.extra}. Fares include toll estimation.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomButtonContainer, { borderTopColor: theme.colors.border }]}>
        <AppButton 
          title="Proceed to Booking" 
          onPress={() => navigation.navigate('RequestRent', { carId: 'selected' })} 
          style={styles.bookButton}
        />
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
    paddingBottom: 120,
  },
  imageContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  vehicleImage: {
    width: '90%',
    height: '100%',
  },
  detailsHeader: {
    marginBottom: spacing.xl,
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviews: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  specCard: {
    width: '47%',
    padding: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  specLabel: {
    fontSize: 11,
  },
  breakdownCard: {
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 13,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    opacity: 0.1,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  extraBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  extraText: {
    fontSize: 12,
    flex: 1,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  bookButton: {
    width: '100%',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
  },
});
