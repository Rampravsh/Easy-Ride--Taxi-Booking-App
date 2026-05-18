import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useTheme, spacing, radius, typography } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../redux/hooks';
import { useGetUserProfileQuery } from '../../../api/user.api';
import { useGetUnreadCountQuery } from '../../../api/notification.api';
import { RideService } from '../../../services/ride.service';

export const HomeScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const isFocused = useIsFocused();
  const mapRef = useRef<MapView>(null);

  const [activeTab, setActiveTab] = useState<'Transport' | 'Delivery' | 'Rental'>('Transport');
  const [mapViewingMode, setMapViewingMode] = useState<'2D' | '3D'>('2D');

  // Redux telemetry
  const activeRide = useAppSelector((state) => state.ride.activeRide);
  const connectionState = useAppSelector((state) => state.socket.connectionState);

  // User Profile RTK query
  const { 
    data: profileResponse, 
    refetch: refetchProfile, 
  } = useGetUserProfileQuery(undefined, { skip: !isFocused });
  
  const profile = profileResponse?.data;
  const userName = profile?.fullName || 'EasyRide Rider';
  const walletBalance = profile?.walletBalance || 0.00;

  // Unread notifications telemetry
  const { 
    data: unreadResponse, 
    refetch: refetchUnread 
  } = useGetUnreadCountQuery(undefined, { skip: !isFocused, pollingInterval: 15000 });
  
  const unreadCount = unreadResponse?.data?.count || 0;

  useEffect(() => {
    if (isFocused) {
      refetchProfile();
      refetchUnread();
    }
  }, [isFocused]);

  // Adjust map viewport if there is an active ride pickup and destination
  useEffect(() => {
    if (activeRide && mapRef.current) {
      const pickupCoords = activeRide.pickupLocation?.coordinates 
        ? { latitude: activeRide.pickupLocation.coordinates[1], longitude: activeRide.pickupLocation.coordinates[0] }
        : null;

      const destCoords = activeRide.dropLocation?.coordinates 
        ? { latitude: activeRide.dropLocation.coordinates[1], longitude: activeRide.dropLocation.coordinates[0] }
        : null;

      const coordinatesToFit: { latitude: number; longitude: number }[] = [];
      if (pickupCoords) coordinatesToFit.push(pickupCoords);
      if (destCoords) coordinatesToFit.push(destCoords);

      if (coordinatesToFit.length >= 2) {
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coordinatesToFit, {
            edgePadding: { top: 120, right: 80, bottom: 320, left: 80 },
            animated: true,
          });
        }, 600);
      }
    }
  }, [activeRide]);

  // Map Navigation Floating Controls
  const handleRecenter = () => {
    if (activeRide?.pickupLocation?.coordinates && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: activeRide.pickupLocation.coordinates[1],
        longitude: activeRide.pickupLocation.coordinates[0],
        latitudeDelta: 0.015,
        longitudeDelta: 0.01,
      }, 1000);
    } else if (mapRef.current) {
      // Recenter to standard city coordinate (SF default fallback coordinates)
      mapRef.current.animateToRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.01,
      }, 1000);
    }
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
    const isCurrently3D = mapViewingMode === '3D';
    mapRef.current.getCamera().then((camera) => {
      camera.pitch = isCurrently3D ? 0 : 45; // Tilt for premium 3D perspective maps
      mapRef.current?.animateCamera(camera, { duration: 600 });
      setMapViewingMode(isCurrently3D ? '2D' : '3D');
    });
  };

  const pickupCoords = activeRide?.pickupLocation?.coordinates 
    ? { latitude: activeRide.pickupLocation.coordinates[1], longitude: activeRide.pickupLocation.coordinates[0] }
    : null;

  const destCoords = activeRide?.dropLocation?.coordinates 
    ? { latitude: activeRide.dropLocation.coordinates[1], longitude: activeRide.dropLocation.coordinates[0] }
    : null;

  const uiRide = activeRide ? RideService.transformRideForUI(activeRide) : null;
  const statusLabel = activeRide ? RideService.getStatusLabel(activeRide.status) : '';
  const hasActiveRide = activeRide && activeRide.status !== 'completed' && activeRide.status !== 'cancelled';

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Immersive Google Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.025,
          longitudeDelta: 0.015,
        }}
        customMapStyle={isDark ? darkMapStyle : []}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {!hasActiveRide ? (
          <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}>
            <View style={[styles.markerRing, { backgroundColor: theme.colors.primary + '20' }]}>
              <View style={[styles.markerDot, { backgroundColor: theme.colors.primary }]} />
            </View>
          </Marker>
        ) : (
          <>
            {pickupCoords && (
              <Marker coordinate={pickupCoords} title="Pickup Coordinates">
                <View style={[styles.activeMarkerContainer, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="location" size={15} color="#000" />
                </View>
              </Marker>
            )}
            {destCoords && (
              <Marker coordinate={destCoords} title="Drop Coordinates">
                <View style={[styles.activeMarkerContainer, { backgroundColor: '#FF5252' }]}>
                  <Ionicons name="flag" size={15} color="#FFF" />
                </View>
              </Marker>
            )}
            {pickupCoords && destCoords && (
              <Polyline
                coordinates={[pickupCoords, destCoords]}
                strokeColor={theme.colors.primary}
                strokeWidth={5}
              />
            )}
          </>
        )}
      </MapView>

      {/* Floating Map Navigation Dials (Zoom, Recenter, Perspective Pitch) */}
      <View style={styles.floatingMapDials}>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={() => handleZoom('in')}>
          <Ionicons name="add" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={() => handleZoom('out')}>
          <Ionicons name="remove" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={handleToggleTilt}>
          <Text style={[styles.dialText, { color: theme.colors.text }]}>{mapViewingMode}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dialBtn, { backgroundColor: theme.colors.background }]} onPress={handleRecenter}>
          <Ionicons name="locate" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Header Panel Top Controls */}
      <SafeAreaView style={styles.topControls}>
        <View style={styles.headerLeftRow}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.colors.background }]}
            onPress={() => navigation.navigate('Menu')}
          >
            <Ionicons name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={[styles.greetingCard, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.greetingSub, { color: theme.colors.textSecondary }]}>WELCOME BACK</Text>
            <Text style={[styles.greetingName, { color: theme.colors.text }]} numberOfLines={1}>
              {userName}
            </Text>
          </View>
        </View>

        <View style={styles.topRightControls}>
          {/* Quick Wallet Summary Pill */}
          <TouchableOpacity 
            style={[styles.walletSummary, { backgroundColor: theme.colors.background }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="wallet-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.walletText, { color: theme.colors.text }]}>
              ${walletBalance.toFixed(2)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.colors.background }]}
            onPress={() => navigation.navigate('Notification' as any)}
          >
            <Ionicons name="notifications" size={24} color={theme.colors.text} />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.danger }]}>
                <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Mobility Dashboard Sheet */}
      {hasActiveRide && uiRide ? (
        /* Realtime Active Ride Floating Controller Card */
        <View style={[styles.activeRideSheet, { backgroundColor: theme.colors.background }]}>
          <View style={styles.sheetHandle} />
          
          <View style={styles.activeRideHeader}>
            <View style={styles.activeRideIndicatorRow}>
              <View style={[styles.pulseCircle, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.activeRideStatusLabel, { color: theme.colors.text }]}>
                {statusLabel}
              </Text>
            </View>
            {connectionState === 'connected' ? (
              <View style={styles.liveIndicator}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.liveIndicatorText}>LIVE</Text>
              </View>
            ) : (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            )}
          </View>

          <View style={[styles.activeDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.activeDriverRow}>
            <Image 
              source={uiRide.driver.avatar} 
              style={styles.activeDriverAvatar} 
            />
            <View style={styles.activeDriverInfo}>
              <Text style={[styles.activeDriverName, { color: theme.colors.text }]}>
                {uiRide.driver.name}
              </Text>
              <Text style={[styles.activeCarName, { color: theme.colors.textSecondary }]}>
                {uiRide.car.name} • {uiRide.car.numberPlate}
              </Text>
              <View style={styles.activeRatingRow}>
                <Ionicons name="star" size={13} color={theme.colors.primary} />
                <Text style={[styles.activeRatingText, { color: theme.colors.textSecondary }]}>
                  {uiRide.driver.rating.toFixed(1)} ★
                </Text>
              </View>
            </View>
            <Image 
              source={uiRide.car.image} 
              style={styles.activeCarImage} 
              resizeMode="contain"
            />
          </View>

          <View style={styles.activeActionRow}>
            <TouchableOpacity 
              style={[styles.miniActionBtn, { borderColor: theme.colors.primary, borderWidth: 1 }]}
              onPress={() => {
                if (uiRide.driver.phone) {
                  Alert.alert('Calling Partner', `Dialing ${uiRide.driver.phone}...`);
                } else {
                  navigation.navigate('Calling');
                }
              }}
            >
              <Ionicons name="call" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.miniActionBtn, { borderColor: theme.colors.primary, borderWidth: 1 }]}
              onPress={() => navigation.navigate('Chat')}
            >
              <Ionicons name="chatbubble" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.trackBtn, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('RideTracking')}
            >
              <Text style={styles.trackBtnText}>Track Live Ride</Text>
              <Ionicons name="arrow-forward" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Default Booking overlay sheet when no ride is active */
        <View style={[styles.bottomOverlay, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.tabBar, { backgroundColor: theme.colors.card }]}>
            {['Transport', 'Delivery', 'Rental'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setActiveTab(tab as any)}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    { color: activeTab === tab ? '#000000' : theme.colors.textSecondary, fontWeight: activeTab === tab ? '800' : '600' }
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border + '33' }]}
            onPress={() => navigation.navigate('Search' as any)}
          >
            <View style={styles.searchPulseRing}>
              <Ionicons name="search" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.searchText, { color: theme.colors.textSecondary }]}>
              Where would you go today?
            </Text>
            <Ionicons name="heart-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
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
  markerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  activeMarkerContainer: {
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
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greetingCard: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    maxWidth: width * 0.45,
  },
  greetingSub: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  greetingName: {
    fontSize: 13,
    fontWeight: '800',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  walletSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  walletText: {
    fontSize: 13,
    fontWeight: '900',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  floatingMapDials: {
    position: 'absolute',
    right: 20,
    top: height * 0.22,
    zIndex: 9,
    gap: spacing.sm,
  },
  dialBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dialText: {
    fontSize: 12,
    fontWeight: '900',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
  },
  searchPulseRing: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 15,
    fontWeight: '600',
  },
  activeRideSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  activeRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  activeRideIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeRideStatusLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4EA',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#137333',
  },
  liveIndicatorText: {
    color: '#137333',
    fontSize: 9,
    fontWeight: '800',
  },
  activeDivider: {
    height: 1,
    opacity: 0.08,
    marginVertical: spacing.md,
  },
  activeDriverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  activeDriverAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: spacing.md,
  },
  activeDriverInfo: {
    flex: 1,
  },
  activeDriverName: {
    fontSize: 15,
    fontWeight: '700',
  },
  activeCarName: {
    fontSize: 12,
    marginTop: 2,
  },
  activeRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  activeRatingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeCarImage: {
    width: 65,
    height: 42,
  },
  activeActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  miniActionBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
  },
  trackBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  trackBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
