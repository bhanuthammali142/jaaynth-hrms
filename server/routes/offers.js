const express = require('express');
const { body } = require('express-validator');
const Offer = require('../models/Offer');
const Application = require('../models/Application');
const Job = require('../models/Job');
const validate = require('../middleware/validate');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Get offer statistics - MUST BE BEFORE /:id route
router.get(
  '/stats/overview',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const stats = await Offer.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
);

// Get all offers (with filters) - HR/Admin only
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const { status } = req.query;
      const offers = await Offer.getAll({ status });
      res.json(offers);
    } catch (error) {
      next(error);
    }
  }
);

// Get single offer - HR/Admin only
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }
      res.json(offer);
    } catch (error) {
      next(error);
    }
  }
);

// Create new offer - HR/Admin only
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('applicationId').notEmpty().withMessage('Application ID is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('salary').isNumeric().withMessage('Valid salary is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { applicationId, position, salary } = req.body;

      // Verify application exists
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Generate offer letter URL (placeholder - would integrate with document generation)
      const offerLetterUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/api/offers/letter/${applicationId}`;

      // Create offer
      const offer = await Offer.create({
        applicationId,
        position,
        salary,
        offerLetterUrl,
      });

      // Update application status to offered
      await Application.updateStatus(applicationId, 'offered');

      // Send offer email to candidate
      try {
        const job = await Job.findById(application.job_id);
        const acceptLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/accept-offer/${offer.id}`;
        
        await emailService.sendOfferLetter({
          candidateName: application.candidate_name,
          candidateEmail: application.candidate_email,
          position,
          salary,
          offerLetterUrl,
          acceptLink,
        });
      } catch (emailError) {
        console.error('Failed to send offer email:', emailError);
      }

      res.status(201).json(offer);
    } catch (error) {
      next(error);
    }
  }
);

// Update offer - HR/Admin only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('salary').isNumeric().withMessage('Valid salary is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { position, salary } = req.body;
      const offerLetterUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/api/offers/letter/${req.params.id}`;

      const offer = await Offer.update(req.params.id, {
        position,
        salary,
        offerLetterUrl,
      });

      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }

      res.json(offer);
    } catch (error) {
      next(error);
    }
  }
);

// Public: Accept/Reject offer
router.patch('/respond/:id', 
  [
    body('status')
      .isIn(['accepted', 'rejected'])
      .withMessage('Status must be accepted or rejected'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { status } = req.body;
      const offer = await Offer.updateStatus(req.params.id, status);
      
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }

      res.json({
        message: `Offer ${status} successfully`,
        offer,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update offer status - HR/Admin only
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('status')
      .isIn(['sent', 'accepted', 'rejected'])
      .withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const offer = await Offer.updateStatus(req.params.id, req.body.status);
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }
      res.json(offer);
    } catch (error) {
      next(error);
    }
  }
);

// Delete offer - Admin only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res, next) => {
    try {
      await Offer.delete(req.params.id);
      res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Generate offer letter (placeholder endpoint)
router.get('/letter/:applicationId', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const offers = await Offer.getByApplicationId(req.params.applicationId);
    if (!offers || offers.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    const offer = offers[0];

    // Generate simple HTML offer letter
    const offerLetter = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
          h1 { color: #333; }
          .details { margin: 20px 0; }
          .signature { margin-top: 60px; }
        </style>
      </head>
      <body>
        <h1>Job Offer Letter</h1>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        
        <p>Dear ${application.candidate_name},</p>
        
        <p>We are pleased to offer you the position of <strong>${offer.position}</strong> at ${process.env.COMPANY_NAME || 'Our Company'}.</p>
        
        <div class="details">
          <h3>Offer Details:</h3>
          <ul>
            <li><strong>Position:</strong> ${offer.position}</li>
            <li><strong>Salary:</strong> $${offer.salary}</li>
            <li><strong>Start Date:</strong> To be determined</li>
          </ul>
        </div>
        
        <p>We look forward to having you join our team!</p>
        
        <div class="signature">
          <p>Sincerely,</p>
          <p><strong>${process.env.COMPANY_NAME || 'Our Company'}</strong><br>
          Human Resources Department</p>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(offerLetter);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
