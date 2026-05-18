import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, Circle } from 'react-native-maps';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme, spacing, radius, typography } from '../../theme';
import { AppButton } from '../../components/AppButton';
import { useAppDispatch } from '../../redux/hooks';
import { setLocationPermissionGranted } from '../../redux/slices/authSlice';
import { setPickupLocation } from '../../redux/slices/rideSlice';
import { LocationService } from '../../services/location.service';
import { Ionicons } from '@expo/vector-icons';

export const EnableLocationScreen = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'EnableLocation'>>();
  const dispatch = useAppDispatch();
  
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Reanimated shared values for glowing ping
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(1.3, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseValue.value }],
      opacity: withTiming(2 - pulseValue.value, { duration: 100 }),
    };
  });

  const handleRequestLocation = async () => {
    setLoading(true);
    setPermissionDenied(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Direct request using Location Service
      const locationData = await LocationService.getCurrentLocation();
      
      // Store in RideSlice
      dispatch(
        setPickupLocation({
          address: locationData.address,
          coordinates: locationData.coordinates,
        })
      );

      // Save permission state inside Redux Slice and local storage
      dispatch(setLocationPermissionGranted(true));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Route seamlessly to Step 2: Notifications Permission Screen
      navigation.navigate('NotificationPermission' as any);
    } catch (err: any) {
      console.warn('[EnableLocationScreen] Access denied:', err);
      setPermissionDenied(true);
      dispatch(setLocationPermissionGranted(false));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        'Location Required',
        'Easy Ride matches you with nearby captains based on your realtime location. Please enable location access in settings or skip for now.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Skip anyway', onPress: () => navigation.navigate('NotificationPermission' as any) }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch(setLocationPermissionGranted(false));
    navigation.navigate('NotificationPermission' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      
      {/* Step Progress indicators */}
      <View style={styles.topHeader}>
        <Text style={[styles.progressLabel, { color: theme.colors.primary }]}>STEP 2 OF 4</Text>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Immersive Map Preview */}
      <Animated.View style={styles.mapContainer} entering={FadeInUp.delay(100)}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.012,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          userInterfaceStyle={isDark ? 'dark' : 'light'}
        >
          {/* Custom pulsing pin in center */}
          <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}>
            <View style={styles.markerContainer}>
              <Animated.View style={[styles.markerPulse, { backgroundColor: theme.colors.primary }, pulseAnimatedStyle]} />
              <View style={[styles.markerCore, { backgroundColor: theme.colors.primary, borderColor: '#FFFFFF' }]} />
            </View>
          </Marker>
        </MapView>
        <View style={[styles.mapOverlay, { backgroundColor: isDark ? 'rgba(28,28,30,0.15)' : 'rgba(255,255,255,0.05)' }]} />
      </Animated.View>

      {/* Permission description card */}
      <Animated.View style={styles.detailsContainer} entering={FadeInDown.delay(200)}>
        <View style={[styles.rationaleCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#2C2C2E' : '#FFF9E6' }]}>
            <Ionicons name="location" size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.rationaleTextWrapper}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Realtime Ride Matching</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>
              Pins your pickup spots instantly to avoid manual typing and calculate ETA precision matches.
            </Text>
          </View>
        </View>

        <View style={styles.textGroup}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Enable Location Access</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            To book, track, and share rides smoothly with friends, please grant us background and foreground device location capabilities.
          </Text>
        </View>

        <View style={styles.footer}>
          <AppButton 
            title={loading ? 'Requesting GPS...' : 'Enable Location Services'} 
            onPress={handleRequestLocation} 
            loading={loading}
            disabled={loading}
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            textStyle={styles.primaryButtonText}
          />
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleSkip}>
            <Text style={[styles.secondaryBtnText, { color: theme.colors.textSecondary }]}>Not now, I will specify manually</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  skipBtn: {
    padding: spacing.xs,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  mapContainer: {
    height: '35%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  markerCore: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  rationaleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rationaleTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
  textGroup: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  footer: {
    width: '100%',
  },
  primaryButton: {
    height: 56,
    borderRadius: radius.button,
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },
  secondaryBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    padding: spacing.sm,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
});
