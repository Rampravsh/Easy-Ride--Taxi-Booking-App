import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import callService from '../../../services/call.service';
import { toggleMute, setSpeaker } from '../../../redux/slices/callSlice';

export const TalkScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();

  // Retrieve active ride & call state from Redux store
  const activeRide = useAppSelector((state) => state.ride.activeRide);
  const callState = useAppSelector((state) => state.call);

  const getDriverName = () => {
    if (activeRide?.rider && typeof activeRide.rider !== 'string') {
      return activeRide.rider.fullName || 'Sergio Ramasis';
    }
    return 'Sergio Ramasis';
  };
  const driverName = getDriverName();

  // 1. Dynamic active timer state increments every second
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds as MM:SS
  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 2. Automatically monitor call status for teardown/navigation transitions
  useEffect(() => {
    if (
      callState.status === 'ended' ||
      callState.status === 'rejected' ||
      callState.status === 'failed' ||
      callState.status === 'idle'
    ) {
      console.log('[TalkScreen] Call session terminated status:', callState.status);
      navigation.goBack();
    }
  }, [callState.status, navigation]);

  // 3. User Interaction Actions
  const handleHangUp = async () => {
    // Attempt to end the active call record
    const callId = callState.activeCall?._id || callState.incomingCall?.callId;
    if (callId) {
      await callService.endCall(callId);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back Button (safely triggers hangup or pops back) */}
      <TouchableOpacity 
        onPress={handleHangUp} 
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        <Text style={[styles.backText, { color: theme.colors.text }]}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image 
            source={
              activeRide?.rider && typeof activeRide.rider !== 'string' && activeRide.rider.profileImage
                ? { uri: activeRide.rider.profileImage }
                : require('../../../../assets/images/driver_sergio.png')
            }
            style={styles.avatar}
          />
        </View>

        <Text style={[styles.name, { color: theme.colors.text }]}>{driverName}</Text>
        <Text style={[styles.timer, { color: theme.colors.text }]}>
          {formatDuration(duration)}
        </Text>
        <Text style={[styles.statusInfo, { color: theme.colors.textSecondary }]}>
          Active Twilio Voice Room
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.controlsRow}>
          {/* Mute Toggle Button */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { backgroundColor: callState.isMuted ? theme.colors.primary : '#FFF9E6' }
            ]}
            onPress={() => dispatch(toggleMute())}
          >
            <Ionicons 
              name={callState.isMuted ? "mic-off" : "mic-outline"} 
              size={24} 
              color={callState.isMuted ? "white" : theme.colors.text} 
            />
          </TouchableOpacity>

          {/* Large Red Hang Up Button */}
          <TouchableOpacity 
            style={[styles.callButton, { backgroundColor: theme.colors.danger }]}
            onPress={handleHangUp}
          >
            <Ionicons name="call" size={30} color="white" style={styles.hangupIcon} />
          </TouchableOpacity>

          {/* Speaker Toggle Button */}
          <TouchableOpacity 
            style={[
              styles.controlButton, 
              { backgroundColor: callState.isSpeakerOn ? theme.colors.primary : '#FFF9E6' }
            ]}
            onPress={() => dispatch(setSpeaker(!callState.isSpeakerOn))}
          >
            <Ionicons 
              name={callState.isSpeakerOn ? "volume-high" : "volume-medium-outline"} 
              size={24} 
              color={callState.isSpeakerOn ? "white" : theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  backText: {
    fontSize: 16,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#F5B800',
    padding: 10,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timer: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginVertical: spacing.xs,
  },
  statusInfo: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  footer: {
    paddingBottom: 60,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  controlButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  hangupIcon: {
    transform: [{ rotate: '135deg' }],
  },
});
