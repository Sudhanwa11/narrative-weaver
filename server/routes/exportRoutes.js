import express from 'express';
import { exportEntries } from '../controllers/exportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, exportEntries);

export default router;