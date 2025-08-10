import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import diaryReducer from '../features/diary/diarySlice';
import themeReducer from '../features/theme/themeSlice'; // Import theme reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diary: diaryReducer,
    theme: themeReducer, // Add theme reducer
  },
});