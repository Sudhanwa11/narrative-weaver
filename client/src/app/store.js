import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import diaryReducer from '../features/diary/diarySlice';
import themeReducer from '../features/theme/themeSlice';
import userReducer from '../features/user/userSlice'; // Import user reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diary: diaryReducer,
    theme: themeReducer,
    user: userReducer, // Add user reducer
  },
});