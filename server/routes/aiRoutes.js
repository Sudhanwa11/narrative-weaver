import express from 'express';
import { generateSummary, generateDeeperAnalysis } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, generateSummary);
router.get('/deeper-analysis', protect, generateDeeperAnalysis); // Add this new route

export default router;