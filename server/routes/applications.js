const express = require('express');
const { body } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Public: Submit application
router.post(
  '/apply/:jobId',
  upload.single('resume'),
  [
    body('candidateName').trim().notEmpty().withMessage('Name is required'),
    body('candidateEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('answers').optional().isJSON().withMessage('Answers must be valid JSON'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { jobId } = req.params;
      const { candidateName, candidateEmail, answers } = req.body;

      // Verify job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.status !== 'active') {
        return res.status(400).json({ error: 'Job is no longer accepting applications' });
      }

      // Get resume URL
      const resumeUrl = req.file 
        ? `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`
        : null;

      // Parse answers if it's a string
      const parsedAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;

      // Calculate simple score (can be enhanced)
      const score = calculateApplicationScore(parsedAnswers);

      // Create application
      const application = await Application.create({
        jobId,
        candidateName,
        candidateEmail,
        resumeUrl,
        answers: parsedAnswers || {},
        score,
      });

      // Send acknowledgment email
      try {
        await emailService.sendApplicationReceived({
          candidateName,
          candidateEmail,
          jobTitle: job.title,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the application submission if email fails
      }

      res.status(201).json({
        message: 'Application submitted successfully',
        application,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get application statistics - MUST BE BEFORE /:id route
router.get(
  '/stats/overview',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const stats = await Application.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
);

// Get all applications (with filters) - HR/Admin only
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const { jobId, status, search, minScore, limit, offset } = req.query;
      const applications = await Application.getAll({
        jobId,
        status,
        search,
        minScore: minScore ? parseInt(minScore) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });
      res.json(applications);
    } catch (error) {
      next(error);
    }
  }
);

// Get single application - HR/Admin only
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.json(application);
    } catch (error) {
      next(error);
    }
  }
);

// Update application status - HR/Admin only
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('status')
      .isIn(['new', 'shortlisted', 'interviewed', 'rejected', 'offered'])
      .withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const application = await Application.updateStatus(req.params.id, status);
      
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Send rejection email if status is rejected
      if (status === 'rejected') {
        try {
          const job = await Job.findById(application.job_id);
          await emailService.sendRejectionEmail({
            candidateName: application.candidate_name,
            candidateEmail: application.candidate_email,
            jobTitle: job.title,
          });
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError);
        }
      }

      res.json(application);
    } catch (error) {
      next(error);
    }
  }
);

// Delete application - Admin only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res, next) => {
    try {
      await Application.delete(req.params.id);
      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Simple scoring function (can be enhanced based on requirements)
function calculateApplicationScore(answers) {
  if (!answers || Object.keys(answers).length === 0) {
    return 0;
  }
  
  let score = 50; // Base score
  
  // Add points for each answered field
  const answerCount = Object.keys(answers).length;
  score += Math.min(answerCount * 5, 50);
  
  return Math.min(score, 100);
}

module.exports = router;
