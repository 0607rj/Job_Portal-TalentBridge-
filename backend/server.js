import dotenv from 'dotenv';
dotenv.config(); // Must be FIRST — ESM imports hoist before module body runs

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import mockInterviewRoutes from './routes/mockInterviewRoutes.js';

// --- Connect to Database ---
connectDB();

const app = express();

// --- Rate Limiting (Brute Force Protection) ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,                   // max 15 auth requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' }
});

// --- Security Middleware Layer ---
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(hpp());
app.use(xss());

// --- API Routing Node ---
app.use('/api/auth', authLimiter, authRoutes); // Rate-limited auth routes
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    // Never expose internal error details in production
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`>>> TalentBridge API running on port ${PORT} | ENV: ${process.env.NODE_ENV || 'development'}`);
});
