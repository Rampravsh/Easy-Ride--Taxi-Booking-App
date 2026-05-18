import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocketConnectionState, RiderLocationUpdate } from '../../types/socket';
import { RideStatus } from '../../types/ride';

interface SocketState {
  connected: boolean;
  reconnecting: boolean;
  connectionState: SocketConnectionState;
  currentRideRoom: string | null;
  riderLiveLocation: RiderLocationUpdate | null;
  socketLatency: number;
  realtimeRideStatus: RideStatus | null;
}

const initialState: SocketState = {
  connected: false,
  reconnecting: false,
  connectionState: 'disconnected',
  currentRideRoom: null,
  riderLiveLocation: null,
  socketLatency: 0,
  realtimeRideStatus: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnectionState(state, action: PayloadAction<SocketConnectionState>) {
      state.connectionState = action.payload;
      state.connected = action.payload === 'connected';
      state.reconnecting = action.payload === 'reconnecting';
    },
    setCurrentRideRoom(state, action: PayloadAction<string | null>) {
      state.currentRideRoom = action.payload;
    },
    setRiderLiveLocation(state, action: PayloadAction<RiderLocationUpdate | null>) {
      state.riderLiveLocation = action.payload;
    },
    setSocketLatency(state, action: PayloadAction<number>) {
      state.socketLatency = action.payload;
    },
    setRealtimeRideStatus(state, action: PayloadAction<RideStatus | null>) {
      state.realtimeRideStatus = action.payload;
    },
    resetSocketState(state) {
      state.currentRideRoom = null;
      state.riderLiveLocation = null;
      state.realtimeRideStatus = null;
    },
  },
});

export const {
  setConnectionState,
  setCurrentRideRoom,
  setRiderLiveLocation,
  setSocketLatency,
  setRealtimeRideStatus,
  resetSocketState,
} = socketSlice.actions;

export default socketSlice.reducer;
