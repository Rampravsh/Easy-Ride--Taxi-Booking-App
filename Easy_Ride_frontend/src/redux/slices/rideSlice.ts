import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Ride,
  RideEstimateResponse,
  RideStatus,
  RideType,
  VehicleCategory,
} from '../../types/ride';
import { GeoCoordinates } from '../../types/user';

export interface LocationState {
  address: string;
  coordinates: GeoCoordinates; // [longitude, latitude]
}

interface RideState {
  activeRide: Ride | null;
  selectedVehicle: RideType | null;
  selectedCategory: VehicleCategory;
  pickupLocation: LocationState | null;
  destinationLocation: LocationState | null;
  rideEstimate: RideEstimateResponse | null;
  rideStatus: RideStatus | null;
  loading: boolean;
  error: string | null;
}

const initialState: RideState = {
  activeRide: null,
  selectedVehicle: 'cab',
  selectedCategory: 'saver',
  pickupLocation: null,
  destinationLocation: null,
  rideEstimate: null,
  rideStatus: null,
  loading: false,
  error: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setActiveRide(state, action: PayloadAction<Ride | null>) {
      state.activeRide = action.payload;
      state.rideStatus = action.payload ? action.payload.status : null;
    },
    setSelectedVehicle(state, action: PayloadAction<RideType | null>) {
      state.selectedVehicle = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<VehicleCategory>) {
      state.selectedCategory = action.payload;
    },
    setPickupLocation(state, action: PayloadAction<LocationState | null>) {
      state.pickupLocation = action.payload;
    },
    setDestinationLocation(state, action: PayloadAction<LocationState | null>) {
      state.destinationLocation = action.payload;
    },
    setRideEstimate(state, action: PayloadAction<RideEstimateResponse | null>) {
      state.rideEstimate = action.payload;
    },
    setRideStatus(state, action: PayloadAction<RideStatus | null>) {
      state.rideStatus = action.payload;
      if (state.activeRide && action.payload) {
        state.activeRide.status = action.payload;
      }
    },
    setRideLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setRideError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetRideWorkflow(state) {
      state.activeRide = null;
      state.rideEstimate = null;
      state.rideStatus = null;
      state.loading = false;
      state.error = null;
    },
    clearRideLocations(state) {
      state.pickupLocation = null;
      state.destinationLocation = null;
      state.rideEstimate = null;
    },
  },
});

export const {
  setActiveRide,
  setSelectedVehicle,
  setSelectedCategory,
  setPickupLocation,
  setDestinationLocation,
  setRideEstimate,
  setRideStatus,
  setRideLoading,
  setRideError,
  resetRideWorkflow,
  clearRideLocations,
} = rideSlice.actions;

export default rideSlice.reducer;
