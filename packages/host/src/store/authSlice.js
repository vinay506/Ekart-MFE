import { createSlice } from '@reduxjs/toolkit';

const MOCK_USERS = {
  admin: { password: 'admin123', name: 'Admin User', role: 'admin' },
  user:  { password: 'user123',  name: 'Guest User', role: 'user'  },
};

const STORAGE_KEY = 'ekart_auth';

const loadPersistedAuth = () => {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadPersistedAuth() ?? {
    user: null,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    login(state, action) {
      const { username, password } = action.payload;
      const match = MOCK_USERS[username];
      if (match && match.password === password) {
        state.user = { username, name: match.name, role: match.role };
        state.isAuthenticated = true;
        state.error = null;
      } else {
        state.error = 'Invalid username or password';
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { login, logout, clearAuthError } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser        = (state) => state.auth.user;
export const selectAuthError       = (state) => state.auth.error;

export default authSlice.reducer;
