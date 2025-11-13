const express = require('express');
const { body } = require('express-validator');
const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');
const validate = require('../middleware/validate');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Get interview statistics - MUST BE BEFORE /:id route
router.get(
  '/stats/overview',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const stats = await Interview.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
);

// Get all interviews (with filters) - HR/Admin only
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const { status, interviewer, startDate, endDate } = req.query;
      const interviews = await Interview.getAll({
        status,
        interviewer,
        startDate,
        endDate,
      });
      res.json(interviews);
    } catch (error) {
      next(error);
    }
  }
);

// Get single interview - HR/Admin only
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const interview = await Interview.findById(req.params.id);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found' });
      }
      res.json(interview);
    } catch (error) {
      next(error);
    }
  }
);

// Schedule new interview - HR/Admin only
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('applicationId').notEmpty().withMessage('Application ID is required'),
    body('scheduledTime').isISO8601().withMessage('Valid scheduled time is required'),
    body('meetingLink').optional().isURL().withMessage('Valid meeting link required'),
    body('notes').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { applicationId, scheduledTime, meetingLink, notes } = req.body;

      // Verify application exists
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Create interview
      const interview = await Interview.create({
        applicationId,
        interviewer: req.user.id,
        scheduledTime,
        meetingLink,
        notes,
      });

      // Update application status to interviewed
      await Application.updateStatus(applicationId, 'interviewed');

      // Send interview email to candidate
      try {
        const job = await Job.findById(application.job_id);
        await emailService.sendInterviewScheduled({
          candidateName: application.candidate_name,
          candidateEmail: application.candidate_email,
          jobTitle: job.title,
          scheduledTime,
          meetingLink: meetingLink || 'Will be shared soon',
        });
      } catch (emailError) {
        console.error('Failed to send interview email:', emailError);
      }

      res.status(201).json(interview);
    } catch (error) {
      next(error);
    }
  }
);

// Update interview - HR/Admin only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('scheduledTime').isISO8601().withMessage('Valid scheduled time is required'),
    body('meetingLink').optional().isURL().withMessage('Valid meeting link required'),
    body('notes').optional().isString(),
    body('status')
      .isIn(['scheduled', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { scheduledTime, meetingLink, notes, status } = req.body;
      const interview = await Interview.update(req.params.id, {
        scheduledTime,
        meetingLink,
        notes,
        status,
      });
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found' });
      }
      res.json(interview);
    } catch (error) {
      next(error);
    }
  }
);

// Update interview status - HR/Admin only
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('status')
      .isIn(['scheduled', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const interview = await Interview.updateStatus(req.params.id, req.body.status);
      if (!interview) {
        return res.status(404).json({ error: 'Interview not found' });
      }
      res.json(interview);
    } catch (error) {
      next(error);
    }
  }
);

// Delete interview - Admin only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res, next) => {
    try {
      await Interview.delete(req.params.id);
      res.json({ message: 'Interview deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
