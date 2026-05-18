import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { AppButton } from '../../../components/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { setPickupLocation, setDestinationLocation } from '../../../redux/slices/rideSlice';
import { LocationService } from '../../../services/location.service';

const { width, height } = Dimensions.get('window');

const RECENT_PLACES = [
  { id: '1', name: 'Workplace Headquarters', address: '2972 Westheimer Rd. Santa Ana, California 92704', distance: '2.7km' },
  { id: '2', name: 'Artisan Coffee Roasters', address: '1901 Thornridge Cir. Shiloh, California 94553', distance: '1.5km' },
  { id: '3', name: 'Metropolitan Shopping Mall', address: '4517 Washington Ave. San Francisco, California 94102', distance: '4.3km' },
  { id: '4', name: 'Bay Area Central Terminal', address: '4140 Parker Rd. San Jose, California 95110', distance: '4.8km' },
];

export const SelectLocationScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);

  const reduxPickup = useSelector((state: RootState) => state.ride.pickupLocation);
  const reduxDestination = useSelector((state: RootState) => state.ride.destinationLocation);

  const [fromAddress, setFromAddress] = useState(reduxPickup?.address || 'Current Location (Pacific Heights, SF)');
  const [toAddress, setToAddress] = useState(reduxDestination?.address || '');
  const [loading, setLoading] = useState(false);
  const [mapPerspective, setMapPerspective] = useState<'2D' | '3D'>('2D');

  // Synchronize state if Redux changes externally
  useEffect(() => {
    if (reduxPickup?.address) {
      setFromAddress(reduxPickup.address);
    }
  }, [reduxPickup]);

  useEffect(() => {
    if (reduxDestination?.address) {
      setToAddress(reduxDestination.address);
    }
  }, [reduxDestination]);

  // Adjust viewport to fit markers when coordinates are set
  useEffect(() => {
    if (mapRef.current && (reduxPickup?.coordinates || reduxDestination?.coordinates)) {
      const coordsToFit: { latitude: number; longitude: number }[] = [];
      if (reduxPickup?.coordinates) {
        coordsToFit.push({
          latitude: reduxPickup.coordinates[1],
          longitude: reduxPickup.coordinates[0],
        });
      }
      if (reduxDestination?.coordinates) {
        coordsToFit.push({
          latitude: reduxDestination.coordinates[1],
          longitude: reduxDestination.coordinates[0],
        });
      }

      if (coordsToFit.length > 0) {
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coordsToFit, {
            edgePadding: { top: 120, right: 80, bottom: height * 0.45, left: 80 },
            animated: true,
          });
        }, 500);
      }
    }
  }, [reduxPickup, reduxDestination]);

  const handleConfirmLocation = async () => {
    if (!fromAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a pickup address.');
      return;
    }
    if (!toAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a destination address.');
      return;
    }

    setLoading(true);
    try {
      // Resolve geocoordinates
      const pickupResult = await LocationService.geocodeAddress(fromAddress);
      const destinationResult = await LocationService.geocodeAddress(toAddress);

      // Hydrate Redux state
      dispatch(setPickupLocation({
        address: pickupResult.address,
        coordinates: pickupResult.coordinates,
      }));
      dispatch(setDestinationLocation({
        address: destinationResult.address,
        coordinates: destinationResult.coordinates,
      }));

      // Direct to transport choices
      navigation.navigate('SelectTransport');
    } catch (err: any) {
      console.error('[SelectLocationScreen] Geocoding failure:', err);
      Alert.alert('Resolution Failed', 'Unable to resolve coordinates for the addresses entered. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecentPlace = (address: string) => {
    setToAddress(address);
  };

  // Map Controls
  const handleRecenter = () => {
    if (!mapRef.current) return;
    const centerLat = reduxPickup?.coordinates?.[1] || 37.78825;
    const centerLng = reduxPickup?.coordinates?.[0] || -122.4324;
    mapRef.current.animateToRegion({
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.012,
    }, 1000);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapRef.current) return;
    mapRef.current.getCamera().then((camera) => {
      if (camera.zoom !== undefined) {
        camera.zoom += direction === 'in' ? 1.2 : -1.2;
        mapRef.current?.animateCamera(camera, { duration: 400 });
      }
    });
  };

  const handleToggleTilt = () => {
    if (!mapRef.current) return;
    const is3D = mapPerspective === '3D';
    mapRef.current.getCamera().then((camera) => {
      camera.pitch = is3D ? 0 : 45; // Tilt camera for premium look
      mapRef.current?.animateCamera(camera, { duration: 600 });
      setMapPerspective(is3D ? '2D' : '3D');
    });
  };

  const mapRegion = {
    latitude: reduxPickup?.coordinates?.[1] || 37.78825,
    longitude: reduxPickup?.coordinates?.[0] || -122.4324,
    latitudeDelta: 0.04,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.container}>
      {/* Immersive Map Background */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapRegion}
        customMapStyle={isDark ? darkMapStyle : []}
      >
        {reduxPickup?.coordinates && (
          <Marker
            coordinate={{
              latitude: reduxPickup.coordinates[1],
              longitude: reduxPickup.coordinates[0],
            }}
            title="Pickup point"
          >
            <View style={[styles.customPin, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="location" size={15} color="#000" />
            </View>
          </Marker>
        )}
        {reduxDestination?.coordinates && (
          <Marker
            coordinate={{
              latitude: reduxDestination.coordinates[1],
              longitude: reduxDestination.coordinates[0],
            }}
            title="Destination point"
          >
            <View style={[styles.customPin, { backgroundColor: '#FF5252' }]}>
              <Ionicons name="flag" size={15} color="#FFF" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Map Control Buttons overlay */}
      <View style={styles.floatingControls}>
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.colors.background }]} onPress={() => handleZoom('in')}>
          <Ionicons name="add" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.colors.background }]} onPress={() => handleZoom('out')}>
          <Ionicons name="remove" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.colors.background }]} onPress={handleToggleTilt}>
          <Text style={[styles.controlText, { color: theme.colors.text }]}>{mapPerspective}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: theme.colors.background }]} onPress={handleRecenter}>
          <Ionicons name="locate" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Floating Back Navigation Button */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.background }]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Premium Sliding Bottom Location Sheet Drawer */}
      <View style={[styles.bottomSheet, { backgroundColor: theme.colors.background }]}>
        <View style={styles.handle} />
        <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>Enter Ride Route</Text>

        <View style={styles.addressSection}>
          <View style={styles.lineIndicator}>
             <Ionicons name="radio-button-on" size={16} color={theme.colors.primary} />
             <View style={[styles.dashLine, { backgroundColor: theme.colors.border + '60' }]} />
             <Ionicons name="location" size={16} color="#FF5252" />
          </View>

          <View style={styles.inputsGrid}>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary + '40', borderWidth: 1 }]}>
               <TextInput 
                 style={[styles.textInput, { color: theme.colors.text }]}
                 value={fromAddress}
                 onChangeText={setFromAddress}
                 placeholder="Enter pickup address"
                 placeholderTextColor={theme.colors.textSecondary}
                 editable={!loading}
               />
               <Ionicons name="locate" size={18} color={theme.colors.primary} />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
               <TextInput 
                 style={[styles.textInput, { color: theme.colors.text }]}
                 value={toAddress}
                 onChangeText={setToAddress}
                 placeholder="Enter destination address"
                 placeholderTextColor={theme.colors.textSecondary}
                 editable={!loading}
                 autoFocus
               />
            </View>
          </View>
        </View>

        {/* Recent Address Searches */}
        <View style={styles.recentContainer}>
          <Text style={[styles.recentHeading, { color: theme.colors.text }]}>Recent Addresses</Text>
          <ScrollView style={styles.recentScroll} showsVerticalScrollIndicator={false}>
            {RECENT_PLACES.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.recentItem} 
                onPress={() => handleSelectRecentPlace(item.address)}
                disabled={loading}
              >
                <View style={[styles.recentIconBox, { backgroundColor: 'rgba(0,0,0,0.02)' }]}>
                  <Ionicons name="time-outline" size={18} color={theme.colors.textSecondary} />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={[styles.placeName, { color: theme.colors.text }]}>{item.name}</Text>
                  <Text style={[styles.placeAddress, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
                <Text style={[styles.recentDistText, { color: theme.colors.textSecondary }]}>{item.distance}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.buttonLoader}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={{ marginLeft: spacing.md, color: theme.colors.textSecondary, fontWeight: '600' }}>
              Resolving trip coordinates...
            </Text>
          </View>
        ) : (
          <AppButton 
            title="Confirm Route" 
            onPress={handleConfirmLocation} 
            style={styles.submitBtn}
          />
        )}
      </View>
    </View>
  );
};

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: spacing.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  customPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingControls: {
    position: 'absolute',
    right: 20,
    top: height * 0.12,
    zIndex: 9,
    gap: spacing.sm,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  controlText: {
    fontSize: 11,
    fontWeight: '900',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.lg,
    paddingBottom: 40,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    height: height * 0.58,
  },
  handle: {
    width: 44,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  addressSection: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  lineIndicator: {
    alignItems: 'center',
    marginRight: spacing.md,
    paddingVertical: 12,
  },
  dashLine: {
    width: 1,
    flex: 1,
    marginVertical: 4,
  },
  inputsGrid: {
    flex: 1,
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  recentContainer: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  recentHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  recentScroll: {
    flex: 1,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  recentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 12,
  },
  recentDistText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: spacing.sm,
    height: 52,
  },
  buttonLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    marginTop: spacing.sm,
  },
});
