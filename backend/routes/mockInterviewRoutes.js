import express from 'express';
import {
  generateQuestions,
  analyzeAnswer,
  saveSession
} from '../controllers/mockInterviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are for candidates only
router.post('/generate-questions', protect, authorize('candidate'), generateQuestions);
router.post('/analyze-answer', protect, authorize('candidate'), analyzeAnswer);
router.post('/save-session', protect, authorize('candidate'), saveSession);

export default router;
