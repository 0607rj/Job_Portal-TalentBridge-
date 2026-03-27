import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

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
      meetingLink,
      location,
      instructions,
      interviewers
    });

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
      interview
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
