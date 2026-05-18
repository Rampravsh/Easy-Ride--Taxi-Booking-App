import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { useTheme, spacing } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import callService from '../../../services/call.service';
import { toggleMute, setSpeaker } from '../../../redux/slices/callSlice';

export const CallingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();

  // Retrieve active ride & call state from store
  const activeRide = useAppSelector((state) => state.ride.activeRide);
  const callState = useAppSelector((state) => state.call);

  const isIncoming = !!callState.incomingCall;
  
  const getDriverName = () => {
    if (activeRide?.rider && typeof activeRide.rider !== 'string') {
      return activeRide.rider.fullName || 'Sergio Ramasis';
    }
    return 'Sergio Ramasis';
  };
  const driverName = getDriverName();
  
  // 1. Manage Outgoing Call Trigger
  useEffect(() => {
    // If not incoming and we haven't initiated a call record yet, start it
    if (!isIncoming && callState.status === 'idle' && activeRide?._id) {
      console.log('[CallingScreen] Initiating call for ride:', activeRide._id);
      callService.initiateCall(activeRide._id, 'audio').catch((err) => {
        console.error('[CallingScreen] Failed to initiate call:', err);
      });
    }
  }, [isIncoming, callState.status, activeRide?._id]);

  // 2. Monitor status for automatic screen transitions
  useEffect(() => {
    if (callState.status === 'accepted') {
      console.log('[CallingScreen] Call accepted! Navigating to Talk Screen...');
      navigation.replace('Talk');
    } else if (
      callState.status === 'rejected' ||
      callState.status === 'ended' ||
      callState.status === 'failed' ||
      callState.status === 'missed'
    ) {
      console.log('[CallingScreen] Call terminated status:', callState.status);
      navigation.goBack();
    }
  }, [callState.status, navigation]);

  // 3. User Controls Actions
  const handleAccept = async () => {
    if (callState.incomingCall) {
      try {
        await callService.acceptCall(callState.incomingCall.callId);
      } catch (err) {
        console.error('[CallingScreen] Failed to accept call:', err);
      }
    }
  };

  const handleReject = async () => {
    if (callState.incomingCall) {
      await callService.rejectCall(callState.incomingCall.callId);
    }
  };

  const handleHangUp = async () => {
    const callId = callState.activeCall?._id;
    if (callId) {
      await callService.endCall(callId);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back button only allowed if we are not locked in active handshake */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
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
        
        {/* Realtime Status Indicator */}
        <View style={styles.statusRow}>
          {callState.loading && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginRight: 8 }} />}
          <Text style={[styles.status, { color: theme.colors.textSecondary }]}>
            {isIncoming 
              ? 'Incoming Voice Call...' 
              : callState.status === 'initiated' 
                ? 'Ringing...' 
                : 'Connecting secure Twilio room...'}
          </Text>
        </View>

        {callState.error && (
          <Text style={styles.errorText}>{callState.error}</Text>
        )}
      </View>

      <View style={styles.footer}>
        {isIncoming ? (
          // Incoming Call Controls: Green Accept, Red Reject
          <View style={styles.incomingControlsRow}>
            <TouchableOpacity 
              style={[styles.callControlSquare, { backgroundColor: theme.colors.danger }]}
              onPress={handleReject}
            >
              <Ionicons name="close" size={32} color="white" />
              <Text style={styles.controlLabel}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.callControlSquare, { backgroundColor: theme.colors.success }]}
              onPress={handleAccept}
            >
              <Ionicons name="call" size={30} color="white" />
              <Text style={styles.controlLabel}>Accept</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Outgoing Call Controls: Mute, Hang Up, Speaker
          <View style={styles.outgoingControlsRow}>
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: callState.isMuted ? theme.colors.primary : '#FFF9E6' }]}
              onPress={() => dispatch(toggleMute())}
            >
              <Ionicons 
                name={callState.isMuted ? "mic-off" : "mic-outline"} 
                size={24} 
                color={callState.isMuted ? "white" : theme.colors.text} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.callButton, { backgroundColor: theme.colors.danger }]}
              onPress={handleHangUp}
            >
              <Ionicons name="call" size={30} color="white" style={styles.hangupIcon} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: callState.isSpeakerOn ? theme.colors.primary : '#FFF9E6' }]}
              onPress={() => dispatch(setSpeaker(!callState.isSpeakerOn))}
            >
              <Ionicons 
                name={callState.isSpeakerOn ? "volume-high" : "volume-medium-outline"} 
                size={24} 
                color={callState.isSpeakerOn ? "white" : theme.colors.text} 
              />
            </TouchableOpacity>
          </View>
        )}
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 60,
  },
  incomingControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  outgoingControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  controlButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callControlSquare: {
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  controlLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
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
