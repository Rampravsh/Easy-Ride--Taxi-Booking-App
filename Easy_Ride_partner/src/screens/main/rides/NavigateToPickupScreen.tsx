import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useTheme } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Reusable Core Components
import { ActiveRideHeader } from '../../../components/ride/ActiveRideHeader';
import { PickupInfoCard } from '../../../components/ride/PickupInfoCard';
import { LiveRouteOverlay } from '../../../components/map/LiveRouteOverlay';
import { RideNavigationPanel } from '../../../components/map/RideNavigationPanel';
import { ETAInfoCard } from '../../../components/map/ETAInfoCard';
import { MapFloatingActions } from '../../../components/map/MapFloatingActions';
import { SocketConnectionBanner } from '../../../components/realtime/SocketConnectionBanner';

const { height } = Dimensions.get('window');

const BENGALURU_COORDS = {
  driver: { latitude: 12.9716, longitude: 77.5946 },
  pickup: { latitude: 12.9785, longitude: 77.6015 },
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

export const NavigateToPickupScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isArrived, setIsArrived] = useState(false);
  const [socketStatus, setSocketStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');

  const handleArrived = () => {
    if (!isArrived) {
      setIsArrived(true);
    } else {
      // Navigate straight to the trip progress screen when arrived checkmark is verified!
      navigation.navigate('RideInProgress');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />

      {/* Socket Channel Banner */}
      <SocketConnectionBanner status={socketStatus} />

      {/* Dynamic Active Ride Header */}
      <ActiveRideHeader 
        tripStatus="pickup" 
        eta="6 mins" 
        distance="2.4 km" 
        onBackPress={() => navigation.goBack()} 
      />

      {/* Interactive Map Layer */}
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: (BENGALURU_COORDS.driver.latitude + BENGALURU_COORDS.pickup.latitude) / 2,
            longitude: (BENGALURU_COORDS.driver.longitude + BENGALURU_COORDS.pickup.longitude) / 2,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          customMapStyle={theme.isDark ? darkMapStyle : []}
        >
          {/* Driver Marker */}
          <Marker coordinate={BENGALURU_COORDS.driver} title="My Location">
            <View style={[styles.dotWrapper, { backgroundColor: theme.colors.primary }]}>
              <View style={styles.innerDot} />
            </View>
          </Marker>

          {/* Passenger Pickup Point Marker */}
          <Marker coordinate={BENGALURU_COORDS.pickup} title="Pickup Point">
            <View style={[styles.dotWrapper, { backgroundColor: theme.colors.success }]}>
              <View style={styles.innerDot} />
            </View>
          </Marker>

          {/* Polyline Route Overlay */}
          <LiveRouteOverlay 
            origin={BENGALURU_COORDS.driver} 
            destination={BENGALURU_COORDS.pickup} 
            lineColor={theme.colors.primary}
          />
        </MapView>

        {/* Floating HUD Turn-by-Turn navigation panel */}
        <View style={styles.hudWrapper}>
          <RideNavigationPanel 
            instructionText="Turn right at Halasuru lake onto KIA Road" 
            turnDistance="250 m" 
            nextActionIcon="arrow-redo" 
          />
        </View>

        {/* Side Floating Actions */}
        <MapFloatingActions 
          onSOSPress={() => {}} 
          onRecenterPress={() => {}} 
        />
      </View>

      {/* Floating Bottom Card Overlays */}
      <View style={styles.footerContainer}>
        <ETAInfoCard eta="08:42 AM" distance="2.4 km" time="6 mins" />
        <View style={{ height: 12 }} />
        <PickupInfoCard 
          pickupAddress="Terminal 3, KIA Road, Kempegowda Intl Airport, Bengaluru" 
          passengerName="Ramprakash S." 
          onArrivedPress={handleArrived} 
          isArrived={isArrived} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  dotWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  hudWrapper: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 10,
  },
});
export default NavigateToPickupScreen;
