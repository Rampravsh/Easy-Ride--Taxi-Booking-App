import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { CallActionFooter } from '../../../components/call/CallActionFooter';
import { MainStackParamList } from '../../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type CallingScreenNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const CallingScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<CallingScreenNavigationProp>();

  // Call connection simulation states
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);

  const passengerName = 'Alex Mercer';
  const passengerAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop';
  const passengerRating = '4.9';

  // Connect simulated call after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallState('connected');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Duration Timer count
  useEffect(() => {
    let interval: any;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleHangup = () => {
    setCallState('ended');
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#111111' }]}>
      {/* Top details */}
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={12} color="rgba(255, 255, 255, 0.4)" />
        <Text style={[styles.encryptedText, { fontFamily: theme.typography.fontFamily.medium }]}>
          VoIP Encrypted • Easy Ride Secure
        </Text>
      </View>

      {/* Center Details */}
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {passengerAvatar ? (
            <Image source={{ uri: passengerAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="person" size={54} color={theme.colors.textSecondary} />
            </View>
          )}
        </View>

        <Text style={[styles.name, { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.white }]}>
          {passengerName}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F5B800" />
          <Text style={[styles.rating, { fontFamily: theme.typography.fontFamily.medium, color: 'rgba(255, 255, 255, 0.7)' }]}>
            {passengerRating} • Passenger
          </Text>
        </View>

        <Text style={[styles.statusText, { fontFamily: theme.typography.fontFamily.medium, color: theme.colors.primary }]}>
          {callState === 'connecting'
            ? 'CONNECTING...'
            : callState === 'ended'
            ? 'CALL ENDED'
            : formatTimer(seconds)}
        </Text>
      </View>

      {/* Action Footer controls */}
      <View style={styles.footerContainer}>
        {callState !== 'ended' && (
          <CallActionFooter
            isMuted={isMuted}
            isSpeakerOn={isSpeakerOn}
            isKeypadVisible={isKeypadVisible}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
            onToggleKeypad={() => setIsKeypadVisible(!isKeypadVisible)}
            onHangup={handleHangup}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  encryptedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#F5B800',
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
  },
  rating: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  footerContainer: {
    width: '100%',
    paddingBottom: 20,
  },
});
export default CallingScreen;
