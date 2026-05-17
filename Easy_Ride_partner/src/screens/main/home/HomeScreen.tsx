import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Reusable Components
import { OnlineStatusBadge } from '../../../components/realtime/OnlineStatusBadge';
import { RealtimePulse } from '../../../components/realtime/RealtimePulse';
import { ConnectionStatus } from '../../../components/realtime/ConnectionStatus';
import { SurgeIndicator } from '../../../components/realtime/SurgeIndicator';
import { MapOverlayControls } from '../../../components/map/MapOverlayControls';
import { CurrentLocationButton } from '../../../components/map/CurrentLocationButton';
import { MapBottomSheet } from '../../../components/map/MapBottomSheet';
import { SurgeZoneOverlay } from '../../../components/map/SurgeZoneOverlay';
import { EarningsCard } from '../../../components/earnings/EarningsCard';
import { DailyStatsCard } from '../../../components/earnings/DailyStatsCard';

const { width, height } = Dimensions.get('window');

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isOnline, setIsOnline] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'excellent' | 'fair' | 'disconnected'>('excellent');
  const [isTrafficActive, setIsTrafficActive] = useState(false);

  // Animations
  const statusAnim = useRef(new Animated.Value(0)).current; // 0 = Offline, 1 = Online
  const pulseScale = useRef(new Animated.Value(1)).current;

  // Toggle Online/Offline State
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    Animated.spring(statusAnim, {
      toValue: !isOnline ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const statusBgColor = statusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.card, theme.colors.primary],
  });

  const statusTextColor = statusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: theme.isDark ? ['#FFFFFF', '#111111'] : ['#1A1A1A', '#111111'],
  });

  // Pulse animation for online active marker
  useEffect(() => {
    if (isOnline) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseScale.setValue(1);
    }
  }, [isOnline]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      {/* Premium Interactive Map View Component */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={theme.isDark ? darkMapStyle : []}
      >
        {/* Dynamic Live Driver Pulse Pin */}
        <Marker coordinate={{ latitude: 12.9716, longitude: 77.5946 }}>
          <Animated.View style={[
            styles.driverPinContainer,
            { transform: [{ scale: pulseScale }] }
          ]}>
            <RealtimePulse active={isOnline} color={theme.colors.primary} size={48} />
          </Animated.View>
        </Marker>

        {/* Surge Hotspot Overlay Layer when Online */}
        {isOnline && (
          <Marker coordinate={{ latitude: 12.9820, longitude: 77.6080 }}>
            <SurgeZoneOverlay 
              locationName="Indiranagar Tech Park" 
              multiplier={1.8} 
              riderCount={42} 
            />
          </Marker>
        )}
      </MapView>

      {/* Floating Status Header Controls */}
      <SafeAreaView style={styles.floatingHeader} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={[styles.menuBtn, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => {}}
          >
            <Ionicons name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.statusBadgeWrapper}>
            <OnlineStatusBadge isOnline={isOnline} />
          </View>

          <ConnectionStatus status={gpsStatus} />
        </View>
      </SafeAreaView>

      {/* Map Interactive Overlay Panel */}
      <MapOverlayControls 
        isTrafficActive={isTrafficActive}
        onPressTraffic={() => setIsTrafficActive(!isTrafficActive)}
      />

      <CurrentLocationButton onPress={() => {}} bottomOffset={isOnline ? 380 : 310} />

      {/* Interactive Bottom Sheet Operational Panel */}
      <MapBottomSheet height={isOnline ? height * 0.44 : height * 0.35}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Online/Offline Dynamic Sliding Slider */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            onPress={toggleOnlineStatus}
            style={styles.toggleContainer}
          >
            <Animated.View style={[styles.toggleBar, { backgroundColor: statusBgColor }]}>
              <Animated.Text style={[styles.toggleText, { color: statusTextColor }]}>
                {isOnline ? 'YOU ARE ONLINE • SWIPE TO GO OFFLINE' : 'GO ONLINE'}
              </Animated.Text>
              <View style={[styles.toggleCircle, { backgroundColor: '#FFFFFF' }]}>
                <Ionicons 
                  name={isOnline ? 'power' : 'chevron-forward'} 
                  size={20} 
                  color={isOnline ? theme.colors.success : '#111111'} 
                />
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* Dynamic Content Panel */}
          {isOnline ? (
            <View style={styles.activeMetrics}>
              <View style={styles.activeLabelRow}>
                <Ionicons name={"radio-outline" as any} size={16} color={theme.colors.primary} />
                <Text style={[styles.activeStatusDesc, { color: theme.colors.text }]}>
                  Looking for nearby booking requests...
                </Text>
              </View>

              <View style={styles.metricsGrid}>
                <View style={[styles.metricSquare, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>TODAY'S TRIP</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.text }]}>12</Text>
                </View>
                <View style={[styles.metricSquare, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>INCENTIVE</Text>
                  <Text style={[styles.metricVal, { color: theme.colors.primary }]}>₹180</Text>
                </View>
              </View>

              {/* Action Simulation Link */}
              <TouchableOpacity 
                style={[styles.simulateBtn, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('IncomingRide')}
              >
                <Ionicons name="sparkles" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.simulateText, { color: theme.colors.text }]}>Simulate Booking Request</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.offlineSummary}>
              <EarningsCard 
                todayEarnings="₹1,245.50" 
                onlineHours="4h 32m" 
                tripsCount={8} 
                acceptanceRate="94%" 
              />
              <View style={{ height: 16 }} />
              <DailyStatsCard 
                dayName="Today's Target Progress" 
                amount="₹1,245 / ₹2,000" 
                trips={8} 
                percentageFilled={0.62} 
              />
            </View>
          )}
        </ScrollView>
      </MapBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  driverPinContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statusBadgeWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  toggleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  toggleBar: {
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  toggleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activeMetrics: {
    paddingBottom: 24,
  },
  activeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  activeStatusDesc: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricSquare: {
    flex: 0.48,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '900',
  },
  simulateBtn: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  offlineSummary: {
    paddingBottom: 24,
  },
});
export default HomeScreen;
