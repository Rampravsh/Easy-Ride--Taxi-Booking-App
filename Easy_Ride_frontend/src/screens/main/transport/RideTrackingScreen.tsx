import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../../../components/AppButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetRideDetailsQuery } from '../../../api/ride.api';
import { setActiveRide, resetRideWorkflow } from '../../../redux/slices/rideSlice';
import { RideService } from '../../../services/ride.service';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { realtimeRideService } from '../../../services/realtimeRide.service';

const { width, height } = Dimensions.get('window');

/**
 * Calculates distance in meters between two geocoordinates using the Haversine formula.
 */
const calculateDistance = (
  coord1: { latitude: number; longitude: number },
  coord2: { latitude: number; longitude: number }
) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // In meters
};

export const RideTrackingScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();
  const mapRef = useRef<MapView>(null);
  const markerRef = useRef<any>(null);

  // Retrieve active ride state and socket connection telemetry from Redux
  const activeRide = useSelector((state: RootState) => state.ride.activeRide);
  const connectionState = useSelector((state: RootState) => state.socket.connectionState);
  const socketLatency = useSelector((state: RootState) => state.socket.socketLatency);
  const riderLiveLocation = useSelector((state: RootState) => state.socket.riderLiveLocation);
  
  const [riderCoords, setRiderCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasFitInitial, setHasFitInitial] = useState(false);
  const [etaText, setEtaText] = useState<string>('');
  const [mapPerspective, setMapPerspective] = useState<'2D' | '3D'>('2D');

  // Socket.IO Room Lifecycle Orchestration
  useEffect(() => {
    if (activeRide?._id) {
      // Connect and join the ride-specific room on mount
      realtimeRideService.initialize();
      realtimeRideService.joinRideRoom(activeRide._id);
    }
    return () => {
      if (activeRide?._id) {
        // Safely leave room and clear listeners on unmount
        realtimeRideService.leaveRideRoom(activeRide._id);
      }
    };
  }, [activeRide?._id]);

  // Interpolation and Smooth Live Rider Movement
  useEffect(() => {
    if (riderLiveLocation) {
      const newCoords = {
        latitude: riderLiveLocation.latitude,
        longitude: riderLiveLocation.longitude,
      };

      if (markerRef.current) {
        // Trigger coordinate transition animation on the map marker
        markerRef.current.animateMarkerToCoordinate(newCoords, 1500);
      }
      setRiderCoords(newCoords);
    } else if (activeRide?.rider && typeof activeRide.rider === 'object' && activeRide.rider.currentLocation) {
      // Fallback: Use initial driver coordinates from MongoDB if streaming GPS feed has not arrived yet
      setRiderCoords({
        latitude: activeRide.rider.currentLocation.coordinates[1],
        longitude: activeRide.rider.currentLocation.coordinates[0],
      });
    }
  }, [riderLiveLocation, activeRide]);

  // HIGH AVAILABILITY POLLING FALLBACK RECOVERY:
  // If the Socket.IO stream is healthy (connected), we slow down polling dramatically to once every 30 seconds
  // to save cellular data and device battery. If connection fails, we accelerate polling back to rapid
  // 3-second checks to provide continuous fallback status tracking.
  const pollingInterval = connectionState === 'connected' ? 30000 : 3000;

  const { data: response, error, isLoading } = useGetRideDetailsQuery(
    activeRide?._id || '',
    {
      skip: !activeRide?._id,
      pollingInterval,
    }
  );

  // Sync REST response directly with Ride slice
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
  const uiRide = RideService.transformRideForUI(rawRide);
  const driver = uiRide.driver;
  const car = uiRide.car;
  const statusLabel = RideService.getStatusLabel(rawRide.status);
  
  const pickupCoords = rawRide.pickupLocation?.coordinates 
    ? { latitude: rawRide.pickupLocation.coordinates[1], longitude: rawRide.pickupLocation.coordinates[0] }
    : null;

  const destCoords = rawRide.dropLocation?.coordinates 
    ? { latitude: rawRide.dropLocation.coordinates[1], longitude: rawRide.dropLocation.coordinates[0] }
    : null;

  // Real-time Dynamic ETA Recalculation
  useEffect(() => {
    if (riderCoords && pickupCoords && (rawRide.status === 'accepted' || rawRide.status === 'arriving')) {
      const dist = calculateDistance(riderCoords, pickupCoords);
      const averageSpeedMps = 8.33; // 30 km/h average speed in city
      const etaSeconds = Math.round(dist / averageSpeedMps);
      const mins = Math.max(1, Math.round(etaSeconds / 60));
      setEtaText(`${mins} mins`);
    } else {
      setEtaText(uiRide.duration);
    }
  }, [riderCoords, pickupCoords, rawRide.status, uiRide.duration]);

  // Adjust Viewport to fit all journey markers initially on mount
  useEffect(() => {
    if (hasFitInitial || !mapRef.current) return;
    
    const coordsToFit = [];
    if (pickupCoords) coordsToFit.push(pickupCoords);
    if (destCoords) coordsToFit.push(destCoords);
    if (riderCoords) coordsToFit.push(riderCoords);
    
    if (coordsToFit.length >= 2) {
      mapRef.current.fitToCoordinates(coordsToFit, {
        edgePadding: { top: 120, right: 80, bottom: height * 0.42, left: 80 },
        animated: true,
      });
      setHasFitInitial(true);
    }
  }, [riderCoords, pickupCoords, destCoords, hasFitInitial]);

  const handleReturnHome = () => {
    dispatch(resetRideWorkflow());
    navigation.navigate('Home' as any);
  };

  const handleRecenter = () => {
    if (!mapRef.current) return;
    const targetRegion = {
      latitude: riderCoords?.latitude || pickupCoords?.latitude || 37.78825,
      longitude: riderCoords?.longitude || pickupCoords?.longitude || -122.4324,
      latitudeDelta: 0.015,
      longitudeDelta: 0.01,
    };
    mapRef.current.animateToRegion(targetRegion, 1000);
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
    latitude: riderCoords?.latitude || pickupCoords?.latitude || 37.78825,
    longitude: riderCoords?.longitude || pickupCoords?.longitude || -122.4324,
    latitudeDelta: 0.02,
    longitudeDelta: 0.01,
  };

  const darkMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
    { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
  ];

  return (
    <View style={styles.container}>
      {/* Real-time Google Maps Viewport */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapRegion}
        customMapStyle={isDark ? darkMapStyle : []}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {pickupCoords && (
          <Marker coordinate={pickupCoords} title="Pickup Coordinates">
            <View style={[styles.customPin, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="location" size={15} color="#000" />
            </View>
          </Marker>
        )}
        
        {destCoords && (
          <Marker coordinate={destCoords} title="Destination Coordinates">
            <View style={[styles.customPin, { backgroundColor: '#FF5252' }]}>
              <Ionicons name="flag" size={15} color="#FFF" />
            </View>
          </Marker>
        )}

        {/* Live Driver Vehicle Marker with interpolation and heading rotation */}
        {riderCoords && (
          <Marker
            ref={markerRef}
            coordinate={riderCoords}
            title={driver.name}
            description="Live rider tracking"
            flat
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={riderLiveLocation?.heading || 0}
          >
            <View style={[styles.driverMarkerContainer, { borderColor: theme.colors.primary }]}>
              <Ionicons name="car-sport" size={24} color="#000" />
            </View>
          </Marker>
        )}

        {/* Dynamic Route Synchronization lines */}
        {pickupCoords && destCoords && rawRide.status === 'started' && (
          <Polyline
            coordinates={[pickupCoords, destCoords]}
            strokeColor={theme.colors.primary}
            strokeWidth={4.5}
          />
        )}

        {riderCoords && pickupCoords && (rawRide.status === 'accepted' || rawRide.status === 'arriving') && (
          <Polyline
            coordinates={[riderCoords, pickupCoords]}
            strokeColor="#1E90FF"
            strokeWidth={4.5}
            lineDashPattern={[6, 4]}
          />
        )}
      </MapView>

      {/* Floating Map Navigation Dials (Zoom, Recenter, Perspective Pitch) */}
      <View style={styles.floatingMapDials}>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={() => handleZoom('in')}>
          <Ionicons name="add" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={() => handleZoom('out')}>
          <Ionicons name="remove" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={handleToggleTilt}>
          <Text style={[styles.dialText, { color: theme.colors.text }]}>{mapPerspective}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={handleRecenter}>
          <Ionicons name="locate" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Top Floating Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.colors.background }]}
          onPress={() => navigation.navigate('Home' as any)}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.otpBadge}>
          <Text style={styles.otpLabel}>SECURITY CODE OTP</Text>
          <Text style={styles.otpValue}>{uiRide.otp}</Text>
        </View>
      </SafeAreaView>

      {/* Reconnect Banner and Quality Indicators */}
      {connectionState !== 'connected' && (
        <View style={[
          styles.statusBanner, 
          { backgroundColor: connectionState === 'reconnecting' ? '#FFF3CD' : '#F8D7DA' }
        ]}>
          <ActivityIndicator size="small" color={connectionState === 'reconnecting' ? '#856404' : '#721C24'} />
          <Text style={[
            styles.statusBannerText, 
            { color: connectionState === 'reconnecting' ? '#856404' : '#721C24' }
          ]}>
            {connectionState === 'reconnecting' 
              ? 'Connecting to live tracking...' 
              : 'Connection lost. Resilient fallback polling active.'}
          </Text>
        </View>
      )}

      {connectionState === 'connected' && (
        <View style={styles.connectedBadge}>
          <View style={styles.greenPulse} />
          <Text style={styles.connectedBadgeText}>Live Satellite Connected ({socketLatency}ms)</Text>
        </View>
      )}

      {/* Bottom Tracking Info Sheet */}
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
          Estimated Arrival Duration: <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{etaText}</Text>
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
               <Ionicons name="navigate-outline" size={12} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
               <Text style={[styles.driverSubText, { color: theme.colors.textSecondary }]}>
                 {car.name} ({car.numberPlate})
               </Text>
            </View>
            <View style={styles.driverStats}>
               <Ionicons name="star" size={12} color={theme.colors.primary} style={{ marginRight: 4 }} />
               <Text style={[styles.driverSubText, { color: theme.colors.textSecondary }]}>
                 {driver.rating} ({driver.totalReviews} trips completed)
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

        <View style={[styles.paymentCard, { backgroundColor: 'rgba(0,0,0,0.02)', borderColor: theme.colors.border + '33', borderWidth: 1 }]}>
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
              <Ionicons name="call" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor: theme.colors.primary, borderWidth: 1.5 }]}
              onPress={() => navigation.navigate('Chat' as any)}
            >
              <Ionicons name="chatbubble" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            
            {rawRide.status === 'searching' || rawRide.status === 'accepted' || rawRide.status === 'arriving' ? (
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('CancelRide')}
              >
                <Text style={styles.cancelButtonText}>Cancel Ride</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.ongoingBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#000" />
                <Text style={styles.ongoingText}>SECURE TRIP ACTIVE</Text>
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
    ...StyleSheet.absoluteFillObject,
    height: height * 0.62,
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
  floatingMapDials: {
    position: 'absolute',
    right: 20,
    top: height * 0.22,
    zIndex: 9,
    gap: spacing.sm,
  },
  dialBtn: {
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
  dialText: {
    fontSize: 11,
    fontWeight: '900',
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
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  otpLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  otpValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  statusBanner: {
    position: 'absolute',
    top: 100,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    zIndex: 11,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  connectedBadge: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 11,
    gap: 6,
  },
  greenPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  connectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  driverMarkerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 35,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  handle: {
    width: 44,
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
    borderRadius: 16,
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
