import socketService from './socket.service';
import { store } from '../redux/store';
import {
  setIncomingCall,
  setActiveCall,
  setCallStatus,
  setTwilioToken,
  resetCallWorkflow,
  setCallLoading,
  setCallError,
} from '../redux/slices/callSlice';
import { callApi } from '../api/call.api';
import { IncomingCallPayload, CallRecord } from '../types/call';

// Socket events corresponding exactly to backend constant declarations
const CALL_EVENTS = {
  CALL_INCOMING: 'call:incoming',
  CALL_ACCEPTED: 'call:accepted',
  CALL_REJECTED: 'call:rejected',
  CALL_ENDED: 'call:ended',
} as const;

class CallService {
  /**
   * Centralized listener registration for voice call socket broadcasts.
   */
  public initialize() {
    console.log('📡 [CallService] Registering call socket listeners...');

    // 1. Listen for Incoming Call from partner/rider
    socketService.on(CALL_EVENTS.CALL_INCOMING, (payload: IncomingCallPayload) => {
      console.log('📡 [CallService] Incoming call event:', payload.callId);
      store.dispatch(setIncomingCall(payload));
    });

    // 2. Listen for Accept signal from receiver
    socketService.on(CALL_EVENTS.CALL_ACCEPTED, (event: { callId: string }) => {
      console.log('📡 [CallService] Call accepted by participant:', event.callId);
      store.dispatch(setCallStatus('accepted'));
    });

    // 3. Listen for Reject signal from receiver
    socketService.on(CALL_EVENTS.CALL_REJECTED, (event: { callId: string }) => {
      console.log('📡 [CallService] Call rejected by participant:', event.callId);
      store.dispatch(setCallStatus('rejected'));
      
      // Auto cleanup call UI after rejection
      setTimeout(() => {
        store.dispatch(resetCallWorkflow());
      }, 1500);
    });

    // 4. Listen for End Call broadcast
    socketService.on(CALL_EVENTS.CALL_ENDED, (event: { callId: string; duration?: number }) => {
      console.log(`📡 [CallService] Call session ended. Duration: ${event.duration || 0}s`);
      store.dispatch(setCallStatus('ended'));
      
      // Reset call slice
      setTimeout(() => {
        store.dispatch(resetCallWorkflow());
      }, 1500);
    });
  }

  /**
   * Proactively initiate a call to a driver linked to a ride ID.
   */
  public async initiateCall(rideId: string, callType: 'audio' | 'video' = 'audio') {
    store.dispatch(setCallLoading(true));
    store.dispatch(setCallError(null));
    
    try {
      const result = await store.dispatch(
        callApi.endpoints.initiateCall.initiate({ rideId, callType })
      ).unwrap();

      if (result.success && result.data) {
        const { call, token } = result.data;
        store.dispatch(setActiveCall(call));
        store.dispatch(setTwilioToken(token));
        store.dispatch(setCallStatus('initiated'));
        return { call, token };
      }
      throw new Error('Call initiation response was unsuccessful');
    } catch (err: any) {
      console.error('[CallService] Failed to initiate call:', err);
      store.dispatch(setCallError(err.message || 'Failed to start call.'));
      store.dispatch(setCallLoading(false));
      throw err;
    }
  }

  /**
   * Accepts an active incoming call.
   */
  public async acceptCall(callId: string) {
    store.dispatch(setCallLoading(true));
    try {
      const result = await store.dispatch(
        callApi.endpoints.acceptCall.initiate(callId)
      ).unwrap();

      if (result.success && result.data) {
        const { token } = result.data;
        store.dispatch(setTwilioToken(token));
        store.dispatch(setCallStatus('accepted'));
        
        // Remove incoming modal, call is active
        store.dispatch(setIncomingCall(null));
        return token;
      }
      throw new Error('Could not retrieve Twilio token to accept call');
    } catch (err: any) {
      console.error('[CallService] Failed to accept call:', err);
      store.dispatch(setCallError(err.message || 'Accepting call failed.'));
      store.dispatch(setCallLoading(false));
      throw err;
    }
  }

  /**
   * Rejects an incoming call.
   */
  public async rejectCall(callId: string) {
    try {
      await store.dispatch(callApi.endpoints.rejectCall.initiate(callId)).unwrap();
      store.dispatch(resetCallWorkflow());
    } catch (err) {
      console.error('[CallService] Reject call failed:', err);
      // fallback local cleanup
      store.dispatch(resetCallWorkflow());
    }
  }

  /**
   * Terminate/hang up an active call session.
   */
  public async endCall(callId: string) {
    try {
      await store.dispatch(callApi.endpoints.endCall.initiate(callId)).unwrap();
      store.dispatch(resetCallWorkflow());
    } catch (err) {
      console.error('[CallService] End call failed:', err);
      // fallback local cleanup
      store.dispatch(resetCallWorkflow());
    }
  }

  /**
   * Disconnect call listeners from socket client.
   */
  public destroy() {
    socketService.off(CALL_EVENTS.CALL_INCOMING);
    socketService.off(CALL_EVENTS.CALL_ACCEPTED);
    socketService.off(CALL_EVENTS.CALL_REJECTED);
    socketService.off(CALL_EVENTS.CALL_ENDED);
  }
}

export const callService = new CallService();
export default callService;
