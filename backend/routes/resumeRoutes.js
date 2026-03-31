import express from 'express';
import {
  enhanceResumeContent,
  saveResume
} from '../controllers/resumeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/enhance', protect, authorize('candidate'), enhanceResumeContent);
router.post('/save', protect, authorize('candidate'), saveResume);

export default router;
