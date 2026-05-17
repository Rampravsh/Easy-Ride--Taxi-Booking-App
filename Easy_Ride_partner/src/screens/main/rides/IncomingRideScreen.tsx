import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Animated, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Reusable Components
import { RideRequestCard } from '../../../components/ride/RideRequestCard';

const { width } = Dimensions.get('window');

export const IncomingRideScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [countdown, setCountdown] = useState(15);
  
  // Animation Values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  // Countdown timer loop
  useEffect(() => {
    if (countdown <= 0) {
      navigation.goBack(); // Auto-dismiss when timeout is reached
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Visual pulses and circular timers logic
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: countdown / 15,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [countdown]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />

      {/* Dark Styled Urgency Header */}
      <View style={[styles.urgencyOverlay, { backgroundColor: '#111111' }]}>
        <SafeAreaView style={styles.safeContainer} edges={['top']}>
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.timerBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.timerText}>{countdown}</Text>
              <Text style={styles.timerSub}>SEC</Text>
            </View>
          </Animated.View>

          <Text style={styles.alertTitle}>INCOMING REQUEST</Text>
          <Text style={styles.alertSubtitle}>New ride request matching your route matches</Text>

          {/* Simulated progress timer bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: barWidth, backgroundColor: theme.colors.primary }]} />
          </View>
        </SafeAreaView>
      </View>

      {/* Main card representation overlay */}
      <View style={styles.cardContainer}>
        <RideRequestCard 
          riderName="Subhash Chandra" 
          riderRating={4.9} 
          pickupAddress="Terminal 3, KIA Road, Kempegowda Intl Airport" 
          dropAddress="Prestige Tech Park, Marathahalli - Sarjapur Outer Ring Rd" 
          distance="32.4 km" 
          duration="48 mins" 
          fareEstimate="₹820.00" 
          surgeMultiplier={1.6} 
          onAccept={() => navigation.navigate('NavigateToPickup' as any)} 
          onDecline={() => navigation.goBack()} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  urgencyOverlay: {
    height: '42%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  safeContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  pulseRing: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F5B800',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  timerText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111111',
    lineHeight: 28,
  },
  timerSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.5,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  alertSubtitle: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -40,
    alignItems: 'center',
  },
});
export default IncomingRideScreen;
