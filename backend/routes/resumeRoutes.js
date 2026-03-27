import express from 'express';
import {
  generateResumeSuggestions,
  saveResume
} from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are for candidates only
router.post('/suggestions', protect, authorize('candidate'), generateResumeSuggestions);
router.post('/save', protect, authorize('candidate'), saveResume);

export default router;
