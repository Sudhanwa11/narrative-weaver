import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateUser as updateAuthUser, logout as logoutAuth } from '../auth/authSlice'; // Added logout

const BACKEND = process.env.REACT_APP_API_URL || '';

const initialState = {
  profile: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Helper to extract friendly error message
const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'An unexpected error occurred'
  );
};

// --- Get user profile ---
export const getUserProfile = createAsyncThunk('user/getProfile', async (_, thunkAPI) => {
  try {
    const authUser = thunkAPI.getState().auth.user;
    if (!authUser?.token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }

    const config = {
      headers: { Authorization: `Bearer ${authUser.token}` },
    };

    const { data } = await axios.get(`${BACKEND}/api/users/profile`, config);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// --- Update user profile ---
export const updateUserProfile = createAsyncThunk('user/updateProfile', async (userData, thunkAPI) => {
  try {
    const authUser = thunkAPI.getState().auth.user;
    if (!authUser?.token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }

    const config = {
      headers: { Authorization: `Bearer ${authUser.token}`, 'Content-Type': 'application/json' },
    };

    const { data } = await axios.put(`${BACKEND}/api/users/profile`, userData, config);

    // Update the auth slice as well
    thunkAPI.dispatch(updateAuthUser(data));

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// --- Change password ---
export const changePassword = createAsyncThunk('user/changePassword', async (passwordData, thunkAPI) => {
  try {
    const authUser = thunkAPI.getState().auth.user;
    if (!authUser?.token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }

    const config = {
      headers: { Authorization: `Bearer ${authUser.token}`, 'Content-Type': 'application/json' },
    };

    const { data } = await axios.put(`${BACKEND}/api/users/change-password`, passwordData, config);
    return data.message || 'Password changed successfully';
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

// --- Delete account ---
export const deleteAccount = createAsyncThunk('user/deleteAccount', async (_, thunkAPI) => {
  try {
    const authUser = thunkAPI.getState().auth.user;
    if (!authUser?.token) {
      return thunkAPI.rejectWithValue('No authentication token found');
    }

    const config = {
      headers: { Authorization: `Bearer ${authUser.token}` },
    };

    await axios.delete(`${BACKEND}/api/users/profile`, config);

    // Logout after deleting account
    thunkAPI.dispatch(logoutAuth());
    return 'Account deleted successfully';
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // --- Get profile ---
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- Update profile ---
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- Change password ---
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- Delete account ---
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        state.profile = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
