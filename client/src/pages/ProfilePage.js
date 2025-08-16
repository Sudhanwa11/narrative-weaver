// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getUserProfile,
  updateUserProfile,
  reset,
  changePassword,
  deleteAccount,
} from '../features/user/userSlice';
import { toggleTheme } from '../features/theme/themeSlice';
import ExportModal from '../components/ExportModal';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, isError, message } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Password UI state (two-step: button -> form)
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete account modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Profile form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    ethnicity: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      dispatch(getUserProfile());
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: profile.gender || '',
        ethnicity: profile.ethnicity || '',
        address: profile.address || '',
      });
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: '',
        gender: '',
        ethnicity: '',
        address: '',
      });
    }
  }, [profile, user]);

  const handleEditClick = () => setIsEditMode(true);
  const handleCancelClick = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: profile.gender || '',
        ethnicity: profile.ethnicity || '',
        address: profile.address || '',
      });
    }
    setIsEditMode(false);
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      dispatch(getUserProfile());
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Password handlers
  const openPasswordForm = () => {
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordFormOpen(true);
  };
  const closePasswordForm = () => {
    setPasswordFormOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };
  const onPasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill all password fields.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      // changePassword thunk should accept { currentPassword, newPassword }
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();

      setPasswordSuccess('Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // auto-close after delay
      setTimeout(() => closePasswordForm(), 1300);
    } catch (err) {
      console.error('Failed to change password:', err);
      setPasswordError(err?.message || err || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete handlers
  const openDeleteModal = () => {
    setDeleteConfirmText('');
    setDeleteError('');
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteConfirmText('');
    setDeleteError('');
  };

  const handleDeleteAccount = async () => {
    // require exact 'DELETE' to proceed
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Type DELETE in the box to confirm deletion.');
      return;
    }
    try {
      setDeleteLoading(true);
      await dispatch(deleteAccount()).unwrap();
      // Navigate to login or home after deletion
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setDeleteError(err?.message || 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isDarkMode = mode === 'dark';
  const handleDarkModeToggle = () => dispatch(toggleTheme());

  const openExportModal = () => setIsExportOpen(true);
  const closeExportModal = () => setIsExportOpen(false);
  const displayProfile = profile || user || {};

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Profile & Settings</h2>
          <button
            onClick={isEditMode ? handleCancelClick : handleEditClick}
            className="bg-wood dark:bg-dark-gold text-white dark:text-ink font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            {isEditMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditMode ? (
          <form
            onSubmit={onSubmit}
            className="bg-white/50 dark:bg-dark-wood/20 p-6 rounded-lg shadow-md border border-wood dark:border-dark-gold"
          >
            <h3 className="text-xl font-bold mb-4">Edit Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'email', 'phone', 'gender', 'ethnicity', 'address'].map((field) => (
                <div key={field} className={field === 'address' ? 'md:col-span-2' : ''}>
                  <label className="font-bold capitalize">{field}</label>
                  <input
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={onChange}
                    className="w-full p-2 rounded mt-1 dark:bg-dark-bg border border-wood/30"
                  />
                </div>
              ))}
              <div>
                <label className="font-bold">Date of Birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={onChange}
                  className="w-full p-2 rounded mt-1 dark:bg-dark-bg border border-wood/30"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gold dark:bg-dark-gold text-ink font-bold py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            {isError && <p className="text-red-500 mt-2">{message}</p>}
          </form>
        ) : (
          <div className="bg-white/50 dark:bg-dark-wood/20 p-6 rounded-lg shadow-md border border-wood dark:border-dark-gold mb-8">
            <h3 className="text-xl font-bold mb-4">Account Information</h3>
            <div className="space-y-2">
              <p><span className="font-bold">Name:</span> {displayProfile.name || 'Not set'}</p>
              <p><span className="font-bold">Email:</span> {displayProfile.email || 'Not set'}</p>
              <p><span className="font-bold">Phone:</span> {displayProfile.phone || 'Not set'}</p>
              <p><span className="font-bold">Date of Birth:</span> {displayProfile.dateOfBirth ? new Date(displayProfile.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
              <p><span className="font-bold">Gender:</span> {displayProfile.gender || 'Not set'}</p>
              <p><span className="font-bold">Ethnicity:</span> {displayProfile.ethnicity || 'Not set'}</p>
              <p><span className="font-bold">Address:</span> {displayProfile.address || 'Not set'}</p>
            </div>
          </div>
        )}

        {/* Settings Card */}
        <div className="mt-8 bg-white/50 dark:bg-dark-wood/20 p-6 rounded-lg shadow-md border border-wood dark:border-dark-gold space-y-6">
          <h3 className="text-xl font-bold mb-4">Settings</h3>

          {/* Dark Mode */}
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

          {/* Export */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Export Diaries</p>
              <p className="text-sm text-ink/70 dark:text-dark-ink/70">Export your journal entries as DOCX, PDF.</p>
            </div>
            <button
              onClick={openExportModal}
              className="bg-wood hover:bg-ink text-white dark:bg-dark-gold dark:hover:bg-opacity-80 dark:text-ink font-bold py-2 px-4 rounded transition-colors"
            >
              Export
            </button>
          </div>

          {/* Change Password (button -> form) aligned like Export */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold">Change Password</h4>
              {!passwordFormOpen && <p className="text-sm text-ink/70 dark:text-dark-ink/70">Click to open password form.</p>}
            </div>

            {/* right side button (same row as Export) */}
            {!passwordFormOpen ? (
              <button
                onClick={openPasswordForm}
                className="bg-gold dark:bg-dark-gold text-ink font-bold py-2 px-4 rounded-lg hover:opacity-90"
              >
                Change Password
              </button>
            ) : null}
          </div>

          {/* show form below when opened (full width) */}
          {passwordFormOpen && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3 mt-3">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={onPasswordChange}
                className="w-full p-2 rounded border border-wood/30 dark:bg-dark-bg"
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={onPasswordChange}
                className="w-full p-2 rounded border border-wood/30 dark:bg-dark-bg"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={onPasswordChange}
                className="w-full p-2 rounded border border-wood/30 dark:bg-dark-bg"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-gold dark:bg-dark-gold text-ink font-bold py-2 px-4 rounded-lg hover:opacity-90"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={closePasswordForm}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}
            </form>
          )}

          {/* Delete Account - align text left & button right */}
          <div className="pt-4 border-t border-wood/30 dark:border-dark-gold/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-red-600">Danger Zone</h4>
                <p className="text-sm mb-0">Permanently delete your account and all data.</p>
              </div>
              <button
                onClick={openDeleteModal}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export modal */}
      <ExportModal isOpen={isExportOpen} onClose={closeExportModal} />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-parchment dark:bg-dark-bg p-6 rounded-lg shadow-xl border border-wood dark:border-dark-gold w-full max-w-lg">
            <h3 className="text-xl font-bold mb-2 text-red-600">Confirm Account Deletion</h3>
            <p className="mb-4 text-ink/80 dark:text-dark-ink/80">
              This will permanently delete your account and <strong>all</strong> associated data (including diary entries).
              This action is irreversible. To confirm, type <code className="px-1 py-0.5 bg-white/60 rounded">DELETE</code> below.
            </p>

            <input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full p-2 rounded border border-wood/30 dark:bg-dark-bg mb-3"
            />

            {deleteError && <p className="text-red-500 text-sm mb-2">{deleteError}</p>}

            <div className="flex justify-end gap-3">
              <button onClick={closeDeleteModal} className="py-2 px-4 rounded bg-gray-200 dark:bg-gray-600">Cancel</button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                className={`py-2 px-4 rounded font-bold text-white ${deleteConfirmText === 'DELETE' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
