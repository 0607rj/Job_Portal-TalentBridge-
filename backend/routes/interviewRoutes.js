import express from 'express';
import {
  scheduleInterview,
  getMyInterviews,
  getRecruiterInterviews,
  getInterviewById,
  updateInterview,
  addInterviewFeedback,
  cancelInterview
} from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Candidate routes
router.get('/my-interviews', protect, authorize('candidate'), getMyInterviews);

// Recruiter routes
router.post('/', protect, authorize('recruiter'), scheduleInterview);
router.get('/recruiter-interviews', protect, authorize('recruiter'), getRecruiterInterviews);
router.put('/:id', protect, authorize('recruiter'), updateInterview);
router.post('/:id/feedback', protect, authorize('recruiter'), addInterviewFeedback);
router.delete('/:id', protect, authorize('recruiter'), cancelInterview);

// Common routes
router.get('/:id', protect, getInterviewById);

export default router;
