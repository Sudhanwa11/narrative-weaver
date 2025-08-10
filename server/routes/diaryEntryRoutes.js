import express from 'express';
import {
  getDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
} from '../controllers/diaryEntryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

router.route('/')
  .get(getDiaryEntries)
  .post(createDiaryEntry);

router.route('/:id')
  .put(updateDiaryEntry)
  .delete(deleteDiaryEntry);

export default router;