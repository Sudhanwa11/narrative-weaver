import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Get user from localStorage if it exists
let user = null;
try {
  user = JSON.parse(localStorage.getItem('user'));
} catch (err) {
  user = null;
}

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user (async thunk)
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user (async thunk)
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reset UI flags
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    // Called by userSlice to keep the header/auth user in sync after profile updates
    updateUser: (state, action) => {
      // If no logged-in user, nothing to update
      if (!state.user) return;

      // Merge only provided fields into state.user (so we don't wipe unspecified fields)
      const updated = { ...state.user, ...action.payload };
      state.user = updated;

      // Persist updated auth user to localStorage
      try {
        localStorage.setItem('user', JSON.stringify(updated));
      } catch (err) {
        // ignore localStorage failures (or log if you want)
        console.warn('Failed to persist updated user to localStorage', err);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        // persist
        try {
          localStorage.setItem('user', JSON.stringify(action.payload));
        } catch (err) {
          console.warn('Failed to persist user after register', err);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        // persist
        try {
          localStorage.setItem('user', JSON.stringify(action.payload));
        } catch (err) {
          console.warn('Failed to persist user after login', err);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        try {
          localStorage.removeItem('user');
        } catch (err) {
          console.warn('Failed to remove user from localStorage on logout', err);
        }
      });
  },
});

// Export actions, including updateUser
export const { reset, updateUser } = authSlice.actions;
export default authSlice.reducer;
