import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../features/theme/themeSlice'; // Import the Redux action

function ProfilePage() {
  // Get user info and the current theme mode from the global Redux store
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  // Determine if dark mode is active based on the Redux state
  const isDarkMode = mode === 'dark';

  // This function now dispatches the global action to change the theme
  const handleDarkModeToggle = () => {
    dispatch(toggleTheme());
  };

  // This function will handle the data export functionality
  const handleBackup = () => {
    alert("Data export functionality would be implemented here!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Profile & Settings</h2>

      {/* User Details Card with dark mode styles */}
      <div className="bg-white/50 p-6 rounded-lg shadow-md border border-wood dark:bg-dark-wood/20 dark:border-dark-gold mb-8">
        <h3 className="text-xl font-bold mb-4">Account Information</h3>
        <div className="space-y-2">
          <p>
            <span className="font-bold">Name:</span> {user?.name}
          </p>
          <p>
            <span className="font-bold">Email:</span> {user?.email}
          </p>
        </div>
      </div>

      {/* Settings Card with dark mode styles */}
      <div className="bg-white/50 p-6 rounded-lg shadow-md border border-wood dark:bg-dark-wood/20 dark:border-dark-gold">
        <h3 className="text-xl font-bold mb-4">Settings</h3>
        <div className="space-y-4">

          {/* Dark Mode Setting */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Dark Mode</p>
              <p className="text-sm text-ink/70 dark:text-dark-ink/70">Switch to a darker, eye-friendly theme.</p>
            </div>
            <label htmlFor="dark-mode-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="dark-mode-toggle"
                  className="sr-only"
                  checked={isDarkMode}
                  onChange={handleDarkModeToggle}
                />
                <div className="block bg-gray-300 w-14 h-8 rounded-full dark:bg-gray-600"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isDarkMode ? 'translate-x-6 bg-dark-gold' : ''}`}></div>
              </div>
            </label>
          </div>

          {/* Backup Setting */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Backup Entries</p>
              <p className="text-sm text-ink/70 dark:text-dark-ink/70">Export all your journal entries as a JSON file.</p>
            </div>
            <button
              onClick={handleBackup}
              className="bg-wood hover:bg-ink text-white dark:bg-dark-gold dark:hover:bg-opacity-80 dark:text-ink font-bold py-2 px-4 rounded transition-colors"
            >
              Export
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;