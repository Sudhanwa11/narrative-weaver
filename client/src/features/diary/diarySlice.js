import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import diaryService from './diaryService';

const initialState = {
  entries: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isDeleting: null, // Add this to track the ID of the entry being deleted
  message: '',
};

// Create new diary entry
export const createEntry = createAsyncThunk(
  'diary/create',
  async (entryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await diaryService.createEntry(entryData, token);
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

// Get user diary entries
export const getEntries = createAsyncThunk(
  'diary/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await diaryService.getEntries(token);
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

// Delete diary entry
export const deleteEntry = createAsyncThunk(
  'diary/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await diaryService.deleteEntry(id, token);
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

// Update diary entry
export const updateEntry = createAsyncThunk(
  'diary/update',
  async (entryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await diaryService.updateEntry(entryData, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEntry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.entries.unshift(action.payload);
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getEntries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.entries = action.payload;
      })
      .addCase(getEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // --- This is the updated section ---
      .addCase(deleteEntry.pending, (state, action) => {
        // When deletion begins, store the ID of the entry being deleted
        state.isDeleting = action.meta.arg;
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        // Reset the deleting state on success
        state.isDeleting = null;
        state.isSuccess = true;
        state.entries = state.entries.filter(
          (entry) => entry._id !== action.payload.id
        );
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        // Reset the deleting state on failure
        state.isDeleting = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateEntry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.entries.findIndex(
          (entry) => entry._id === action.payload._id
        );
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(updateEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = diarySlice.actions;
export default diarySlice.reducer;