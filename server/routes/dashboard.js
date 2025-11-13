const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Offer = require('../models/Offer');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get dashboard overview statistics
router.get(
  '/overview',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const [jobStats, applicationStats, interviewStats, offerStats] = await Promise.all([
        Job.getStats(),
        Application.getStats(),
        Interview.getStats(),
        Offer.getStats(),
      ]);

      res.json({
        jobs: jobStats,
        applications: applicationStats,
        interviews: interviewStats,
        offers: offerStats,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get recent activity
router.get(
  '/recent-activity',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const recentApplications = await Application.getAll({ limit: 5 });
      const upcomingInterviews = await Interview.getAll({ 
        status: 'scheduled',
        startDate: new Date().toISOString() 
      });

      res.json({
        recentApplications,
        upcomingInterviews: upcomingInterviews.slice(0, 5),
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
