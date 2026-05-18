import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallState, CallRecord, IncomingCallPayload, CallStatus } from '../../types/call';

const initialState: CallState = {
  activeCall: null,
  incomingCall: null,
  twilioToken: null,
  status: 'idle',
  isMuted: false,
  isSpeakerOn: false,
  loading: false,
  error: null,
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setIncomingCall(state, action: PayloadAction<IncomingCallPayload | null>) {
      state.incomingCall = action.payload;
      if (action.payload) {
        state.status = 'initiated'; // Incoming call is initiated/ringing
      } else if (state.status === 'initiated') {
        state.status = 'idle';
      }
    },
    setActiveCall(state, action: PayloadAction<CallRecord | null>) {
      state.activeCall = action.payload;
      if (action.payload) {
        state.status = action.payload.status as CallStatus;
      }
    },
    setCallStatus(state, action: PayloadAction<CallStatus>) {
      state.status = action.payload;
      if (state.activeCall) {
        state.activeCall.status = action.payload;
      }
    },
    setTwilioToken(state, action: PayloadAction<string | null>) {
      state.twilioToken = action.payload;
    },
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    setSpeaker(state, action: PayloadAction<boolean>) {
      state.isSpeakerOn = action.payload;
    },
    setCallLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCallError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetCallWorkflow(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setIncomingCall,
  setActiveCall,
  setCallStatus,
  setTwilioToken,
  toggleMute,
  setSpeaker,
  setCallLoading,
  setCallError,
  resetCallWorkflow,
} = callSlice.actions;

export default callSlice.reducer;
