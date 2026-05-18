import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, SavedAddress, UserPreferences } from '../../types/user';

interface UserState {
  profile: UserProfile | null;
  addresses: SavedAddress[];
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  addresses: [],
  preferences: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload;
      state.addresses = action.payload?.savedAddresses || [];
      state.preferences = action.payload?.preferences || null;
    },
    setAddresses(state, action: PayloadAction<SavedAddress[]>) {
      state.addresses = action.payload;
      if (state.profile) {
        state.profile.savedAddresses = action.payload;
      }
    },
    setPreferences(state, action: PayloadAction<UserPreferences | null>) {
      state.preferences = action.payload;
      if (state.profile && action.payload) {
        state.profile.preferences = action.payload;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUserProfile, setAddresses, setPreferences, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
