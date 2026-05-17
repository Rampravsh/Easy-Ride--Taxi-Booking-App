import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useTheme } from '../../../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Reusable Components
import { ActiveRideHeader } from '../../../components/ride/ActiveRideHeader';
import { DropInfoCard } from '../../../components/ride/DropInfoCard';
import { PassengerInfoCard } from '../../../components/ride/PassengerInfoCard';
import { RideProgressStepper } from '../../../components/ride/RideProgressStepper';
import { LiveRouteOverlay } from '../../../components/map/LiveRouteOverlay';
import { ETAInfoCard } from '../../../components/map/ETAInfoCard';
import { RideNavigationPanel } from '../../../components/map/RideNavigationPanel';
import { MapFloatingActions } from '../../../components/map/MapFloatingActions';
import { SocketConnectionBanner } from '../../../components/realtime/SocketConnectionBanner';
import { RideSyncIndicator } from '../../../components/realtime/RideSyncIndicator';

const { height } = Dimensions.get('window');

const BENGALURU_COORDS = {
  driver: { latitude: 12.9785, longitude: 77.6015 },
  drop: { latitude: 12.9348, longitude: 77.6189 }, // HSR / Outer Ring Rd Area
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

export const RideInProgressScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [syncState, setSyncState] = useState<'synchronized' | 'syncing' | 'failed'>('synchronized');

  // Live timer representing trip duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
      // Randomly simulate socket database syncer pulse for realistic prototype operational feel!
      if (Math.random() > 0.8) {
        setSyncState('syncing');
        setTimeout(() => setSyncState('synchronized'), 1200);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleCompleteTrip = () => {
    navigation.navigate('RideCompleted');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      {/* Socket Connection Alert Banner */}
      <SocketConnectionBanner status="connected" />

      {/* Screen Header showing active trip status */}
      <ActiveRideHeader 
        tripStatus="inprogress" 
        eta="14 mins" 
        distance="5.8 km" 
        onBackPress={() => navigation.goBack()} 
      />

      {/* Main Interactive Map Block */}
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: (BENGALURU_COORDS.driver.latitude + BENGALURU_COORDS.drop.latitude) / 2,
            longitude: (BENGALURU_COORDS.driver.longitude + BENGALURU_COORDS.drop.longitude) / 2,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
          customMapStyle={theme.isDark ? darkMapStyle : []}
        >
          {/* Driver Pin */}
          <Marker coordinate={BENGALURU_COORDS.driver} title="Driver Position">
            <View style={[styles.pulseCircle, { backgroundColor: theme.colors.primary }]}>
              <View style={styles.centerDot} />
            </View>
          </Marker>

          {/* Destination Drop Pin */}
          <Marker coordinate={BENGALURU_COORDS.drop} title="Destination Drop">
            <View style={[styles.pulseCircle, { backgroundColor: theme.colors.danger }]}>
              <View style={styles.centerDot} />
            </View>
          </Marker>

          {/* Route Overlay Line */}
          <LiveRouteOverlay 
            origin={BENGALURU_COORDS.driver} 
            destination={BENGALURU_COORDS.drop} 
            lineColor={theme.colors.success}
          />
        </MapView>

        {/* Floating Navigation Guidance overlay */}
        <View style={styles.hudWrapper}>
          <RideNavigationPanel 
            instructionText="Continue straight for 2.1 km onto HSR Ring Road" 
            turnDistance="2.1 km" 
            nextActionIcon="arrow-up" 
          />
        </View>

        {/* Micro Telemetry state indicators */}
        <View style={styles.syncWrapper}>
          <RideSyncIndicator syncState={syncState} />
        </View>

        {/* Floating Utility and safety actions */}
        <MapFloatingActions 
          onSOSPress={() => {}} 
          onRecenterPress={() => {}} 
        />
      </View>

      {/* Floating Interactive Operational Bottom sheets */}
      <View style={styles.footerContainer}>
        {/* Dynamic timer & telemetry statistics overlay card */}
        <View style={[styles.statsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{formatTimer(secondsElapsed)}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>TRIP TIMER</Text>
          </View>
          <View style={[styles.statLine, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>₹184.20</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>LIVE FARE</Text>
          </View>
          <View style={[styles.statLine, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>18 km/h</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>SPEED</Text>
          </View>
        </View>

        <View style={{ height: 12 }} />

        {/* Passenger core communication details card */}
        <PassengerInfoCard 
          passengerName="Ramprakash S." 
          rating={4.9} 
          onCallPress={() => navigation.navigate('Calling')} 
          onChatPress={() => navigation.navigate('Chat', { rideId: 'ER-9828' })} 
        />

        <View style={{ height: 12 }} />

        {/* Destination layout & slide-to-end trigger card */}
        <DropInfoCard 
          dropAddress="Prestige Tech Park, Outer Ring Road, Marathahalli, Bengaluru" 
          onEndRidePress={handleCompleteTrip} 
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
  pulseCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  centerDot: {
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
  syncWrapper: {
    position: 'absolute',
    top: 110,
    left: 16,
    zIndex: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statLine: {
    width: 1,
    height: 24,
  },
});
export default RideInProgressScreen;
