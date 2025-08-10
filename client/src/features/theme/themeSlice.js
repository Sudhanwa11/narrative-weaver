import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Check localStorage for a saved theme, otherwise default to 'light'
  mode: localStorage.getItem('theme') || 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save the new theme preference to localStorage
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;