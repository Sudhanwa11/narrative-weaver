import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import DiaryEntry from '../models/diaryEntryModel.js'; // 1. Import DiaryEntry model to delete entries
import bcrypt from 'bcryptjs'; // 2. Import bcrypt to compare passwords

// This function generates a JWT and remains the same
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// The registerUser function remains the same
export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// The loginUser function remains the same
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// The getUserProfile function remains the same
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- THIS IS THE CORRECTED UPDATE FUNCTION ---
/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // This corrected logic allows saving empty strings to clear fields
      user.phone = req.body.phone;
      user.dateOfBirth = req.body.dateOfBirth || null; // Set to null if empty
      user.gender = req.body.gender;
      user.ethnicity = req.body.ethnicity;
      user.address = req.body.address;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        ethnicity: updatedUser.ethnicity,
        address: updatedUser.address,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW FUNCTION TO CHANGE PASSWORD ---
/**
 * @desc    Change user password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide both current and new passwords.' });
  }

  try {
    const user = await User.findById(req.user._id);

    // Check if the provided current password is correct
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword; // The pre-save hook in the userModel will automatically hash this new password
      await user.save();
      res.json({ message: 'Password updated successfully.' });
    } else {
      res.status(401).json({ message: 'Invalid current password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while changing password.' });
  }
};

// --- NEW FUNCTION TO DELETE ACCOUNT ---
/**
 * @desc    Delete user account and all their data
 * @route   DELETE /api/users/profile
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // First, delete all the user's diary entries to clean up the database
      await DiaryEntry.deleteMany({ user: req.user._id });
      
      // Then, delete the user account itself
      await user.deleteOne();
      
      res.json({ message: 'Account and all associated data deleted successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting account.' });
  }
};
