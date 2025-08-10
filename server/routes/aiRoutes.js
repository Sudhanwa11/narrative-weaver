import express from 'express';
import { generateMonthlySummary } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route is protected, meaning a user must be logged in to access it.
router.get('/summary', protect, generateMonthlySummary);

export default router;