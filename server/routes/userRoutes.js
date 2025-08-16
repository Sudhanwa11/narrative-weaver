import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,   // 1. Import new function
  updateUserProfile,  // 2. Import new function
  changePassword,
  deleteAccount,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // 3. Import protect middleware

const router = express.Router();

// Public routes for registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/change-password', protect, changePassword);
router.delete('/profile', protect, deleteAccount);

// --- NEW PROTECTED ROUTE FOR USER PROFILE ---
// This route handles two HTTP methods:
// GET: Fetches the logged-in user's profile data.
// PUT: Updates the logged-in user's profile data.
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
// --- END OF NEW ROUTE ---

export default router;