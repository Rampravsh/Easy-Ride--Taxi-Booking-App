import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  email: string;
  role: 'super_admin' | 'operations_admin' | 'finance_admin' | 'support_admin' | 'analytics_admin';
  displayName?: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    uid: '1',
    email: 'admin@easyride.com',
    role: 'super_admin',
    displayName: 'Super Admin',
  }, // Mock user for now
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
