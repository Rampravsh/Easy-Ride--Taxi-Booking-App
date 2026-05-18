import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { AuthHeader } from '../../../components/AuthHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetRideEstimateMutation } from '../../../api/ride.api';
import {
  setSelectedVehicle,
  setSelectedCategory,
  setRideEstimate,
} from '../../../redux/slices/rideSlice';
import { RideType, VehicleCategory } from '../../../types/ride';

interface TransportType {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: RideType;
  category: VehicleCategory;
}

const TRANSPORT_TYPES: TransportType[] = [
  { id: 'car', name: 'Car Cab', icon: 'car', color: '#FF5252', type: 'car', category: 'economy' },
  { id: 'bike', name: 'Bike Ride', icon: 'motorbike', color: '#448AFF', type: 'bike', category: 'economy' },
  { id: 'taxi', name: 'Premium Taxi', icon: 'taxi', color: '#FFD700', type: 'car', category: 'premium' },
  { id: 'auto', name: 'Easy Auto', icon: 'moped', color: '#4CAF50', type: 'auto', category: 'economy' },
];

export const SelectTransportScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const pickup = useSelector((state: RootState) => state.ride.pickupLocation);
  const destination = useSelector((state: RootState) => state.ride.destinationLocation);
  const currentSelectedVehicle = useSelector((state: RootState) => state.ride.selectedVehicle);
  const currentSelectedCategory = useSelector((state: RootState) => state.ride.selectedCategory);

  const [getEstimate, { isLoading }] = useGetRideEstimateMutation();

  const handleSelectTransport = async (item: TransportType) => {
    if (!pickup?.coordinates || !destination?.coordinates) {
      Alert.alert('Missing Locations', 'Please select both pickup and destination addresses first.');
      return;
    }

    try {
      // 1. Fetch Swagger-compliant estimation
      const response = await getEstimate({
        pickupCoordinates: pickup.coordinates,
        dropCoordinates: destination.coordinates,
        rideType: item.type,
        rideCategory: item.category,
      }).unwrap();

      if (response.success && response.data) {
        // 2. Synchronize selection state and responses in Redux
        dispatch(setSelectedVehicle(item.type));
        dispatch(setSelectedCategory(item.category));
        dispatch(setRideEstimate(response.data));

        // 3. Route to Available Cars view
        navigation.navigate('AvailableCars');
      } else {
        throw new Error(response.message || 'Unable to calculate estimates');
      }
    } catch (err: any) {
      console.error('[SelectTransportScreen] Fetch estimate error:', err);
      const errMsg = err.data?.message || err.message || 'An error occurred while calculating ride fares.';
      Alert.alert('Estimate Failed', errMsg);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AuthHeader title="Select transport" onBack={() => navigation.goBack()} />
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loaderText, { color: theme.colors.textSecondary }]}>
            Computing optimal fares & distances...
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Select your transport</Text>
          
          <View style={styles.grid}>
            {TRANSPORT_TYPES.map((item) => {
              const isSelected =
                currentSelectedVehicle === item.type &&
                currentSelectedCategory === item.category;

              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.card, 
                    { backgroundColor: isSelected ? theme.colors.primary : theme.colors.card },
                    !isSelected && { borderWidth: 1, borderColor: theme.colors.border + '40' }
                  ]}
                  onPress={() => handleSelectTransport(item)}
                >
                  <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons 
                      name={item.icon as any} 
                      size={54} 
                      color={isSelected ? '#000000' : item.color} 
                    />
                  </View>
                  <Text style={[
                    styles.name, 
                    { color: isSelected ? '#000000' : theme.colors.text }
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loaderText: {
    marginTop: spacing.lg,
    fontSize: 15,
    textAlign: 'center',
  },
});
