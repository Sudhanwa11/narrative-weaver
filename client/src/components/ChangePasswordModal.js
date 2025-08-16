import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function ChangePasswordModal({ isOpen, onClose }) {
  const token = useSelector((state) => state.auth.user?.token); // safer destructuring
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { currentPassword, newPassword };
      await axios.put('/api/users/change-password', body, config);

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      const id = setTimeout(() => onClose(), 2000);
      setTimeoutId(id);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId); // cleanup to prevent memory leaks
    };
  }, [timeoutId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-parchment dark:bg-dark-bg p-6 rounded-lg shadow-xl border border-wood dark:border-dark-gold w-full max-w-md mx-4">
        <h3 className="text-2xl font-bold mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 rounded dark:bg-dark-bg border border-wood/30"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded dark:bg-dark-bg border border-wood/30"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded dark:bg-dark-bg border border-wood/30"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-2 px-4 rounded font-semibold bg-wood text-white dark:bg-dark-gold dark:text-ink"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
