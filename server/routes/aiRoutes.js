import express from 'express';
import { generateSummary, generateDeeperAnalysis } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for the initial, personalized summary
router.get('/summary', protect, generateSummary);

// Route for the "Go Deeper" psychoanalytic analysis
router.get('/deeper-analysis', protect, generateDeeperAnalysis);

export default router;