import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import { sendMeetingStartEmail } from '../utils/emailService.js';
import User from '../models/User.js';

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private (Recruiter only)
export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      title,
      type,
      scheduledDate,
      duration,
      meetingLink,
      location,
      instructions,
      interviewers
    } = req.body;

    // Check if application exists
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('candidate');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if recruiter owns the job
    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule interview for this application'
      });
    }

    // Create interview
    const interview = await Interview.create({
      application: applicationId,
      job: application.job._id,
      candidate: application.candidate._id,
      recruiter: req.user.id,
      title,
      type,
      scheduledDate,
      duration,
      meetingLink: meetingLink || '',
      location,
      instructions,
      interviewers
    });

    interview.meetingLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/interview/${interview._id}`;
    await interview.save();

    // Update application status
    application.status = 'Interview Scheduled';
    application.statusHistory.push({
      status: 'Interview Scheduled',
      changedBy: req.user.id,
      changedAt: new Date(),
      note: `Interview scheduled for ${new Date(scheduledDate).toLocaleString()}`
    });
    await application.save();

    await interview.populate([
      { path: 'candidate', select: 'name email phone' },
      { path: 'job', select: 'title company' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview,
      meetingLink: interview.meetingLink
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling interview',
      error: error.message
    });
  }
};

// @desc    Get interviews for candidate
// @route   GET /api/interviews/my-interviews
// @access  Private (Candidate only)
export const getMyInterviews = async (req, res) => {
  try {
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    const query = { candidate: req.user.id };
    
    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
      query.status = { $in: ['Scheduled', 'Rescheduled'] };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const interviews = await Interview.find(query)
      .populate('job', 'title company location')
      .populate('recruiter', 'name email company')
      .sort('scheduledDate')
      .skip(skip)
      .limit(limitNum);

    const total = await Interview.countDocuments(query);

    res.status(200).json({
      success: true,
      count: interviews.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      interviews
    });
  } catch (error) {
    console.error('Get my interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
};

// @desc    Get interviews scheduled by recruiter
// @route   GET /api/interviews/recruiter-interviews
// @access  Private (Recruiter only)
export const getRecruiterInterviews = async (req, res) => {
  try {
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    const query = { recruiter: req.user.id };
    
    if (status) {
      query.status = status;
    }

    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
      query.status = { $in: ['Scheduled', 'Rescheduled'] };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const interviews = await Interview.find(query)
      .populate('candidate', 'name email phone profile')
      .populate('job', 'title company')
      .populate('application', 'status')
      .sort('scheduledDate')
      .skip(skip)
      .limit(limitNum);

    const total = await Interview.countDocuments(query);

    res.status(200).json({
      success: true,
      count: interviews.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      interviews
    });
  } catch (error) {
    console.error('Get recruiter interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private (Candidate or Recruiter)
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', 'name email phone profile')
      .populate('recruiter', 'name email company')
      .populate('job')
      .populate('application');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Check authorization
    if (
      interview.candidate._id.toString() !== req.user.id &&
      interview.recruiter._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this interview'
      });
    }

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    console.error('Get interview by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interview',
      error: error.message
    });
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private (Recruiter only)
export const updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this interview'
      });
    }

    // If rescheduling
    if (req.body.scheduledDate && req.body.scheduledDate !== interview.scheduledDate) {
      req.body.status = 'Rescheduled';
    }

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate([
      { path: 'candidate', select: 'name email' },
      { path: 'job', select: 'title company' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      interview
    });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating interview',
      error: error.message
    });
  }
};

// @desc    Add feedback to interview
// @route   POST /api/interviews/:id/feedback
// @access  Private (Recruiter only)
export const addInterviewFeedback = async (req, res) => {
  try {
    const { rating, comments, strengths, weaknesses, recommendation } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add feedback to this interview'
      });
    }

    interview.feedback = {
      rating,
      comments,
      strengths,
      weaknesses,
      recommendation,
      addedBy: req.user.id,
      addedAt: new Date()
    };

    interview.status = 'Completed';
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Feedback added successfully',
      interview
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message
    });
  }
};

// @desc    Cancel interview
// @route   DELETE /api/interviews/:id
// @access  Private (Recruiter only)
export const cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this interview'
      });
    }

    interview.status = 'Cancelled';
    await interview.save();

    res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling interview',
      error: error.message
    });
  }
};

// @desc    Start meeting (notify candidate)
// @route   POST /api/interviews/:id/start
// @access  Private (Recruiter only)
export const startMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.id;

    // Get io instance from app
    const io = req.app.get('io');

    const interview = await Interview.findById(id)
      .populate('candidate', 'name email')
      .populate('recruiter', 'name')
      .populate('job', 'title');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    // Verify recruiter owns this interview
    if (interview.recruiter._id.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to start this interview'
      });
    }

    // Update interview status
    interview.meetingStatus = 'in_progress';
    interview.meetingStartedAt = new Date();
    interview.status = 'In Progress';
    await interview.save();

    const candidateId = interview.candidate._id.toString();
    const candidateEmail = interview.candidate.email;
    const candidateName = interview.candidate.name;
    const recruiterName = interview.recruiter.name;
    const jobTitle = interview.job?.title || 'Position';
    const meetingLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/interview/${id}`;

    // Create notification in database
    const notification = await Notification.create({
      userId: candidateId,
      type: 'meeting_start',
      title: '🔴 Interview Starting Now!',
      message: `${recruiterName} is waiting for you in the interview room for ${jobTitle}`,
      interviewId: id,
      meetingLink,
      recruiterName,
      jobTitle,
      isRead: false
    });

    // Send real-time Socket.IO notification
    if (io) {
      io.to(candidateId).emit('call-notification', {
        interviewId: id,
        recruiterName,
        jobTitle,
        meetingLink,
        notificationId: notification._id
      });

      io.to(candidateId).emit('new-notification', {
        notification: {
          _id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          interviewId: id,
          meetingLink,
          recruiterName,
          jobTitle,
          isRead: false,
          createdAt: notification.createdAt
        }
      });
    }

    // Send email notification
    try {
      await sendMeetingStartEmail(
        candidateEmail,
        candidateName,
        jobTitle,
        recruiterName,
        meetingLink,
        id
      );
      interview.notificationSent = true;
      await interview.save();
    } catch (emailError) {
      console.error('Error sending meeting start email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Meeting started and candidate notified',
      interview: {
        _id: interview._id,
        meetingStatus: interview.meetingStatus,
        meetingStartedAt: interview.meetingStartedAt,
        notificationSent: interview.notificationSent
      },
      notification
    });
  } catch (error) {
    console.error('Start meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting meeting',
      error: error.message
    });
  }
};
