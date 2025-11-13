const express = require('express');
const { body } = require('express-validator');
const Job = require('../models/Job');
const validate = require('../middleware/validate');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get job statistics - MUST BE BEFORE /:id route
router.get(
  '/stats/overview',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  async (req, res, next) => {
    try {
      const stats = await Job.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
);

// Get all jobs (with filters)
router.get('/', async (req, res, next) => {
  try {
    const { status, department } = req.query;
    const jobs = await Job.getAll({ status, department });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

// Get single job
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
});

// Create new job (HR/Admin only)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('formSchema').isArray().withMessage('Form schema must be an array'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, department, description, formSchema } = req.body;
      const job = await Job.create({
        title,
        department,
        description,
        formSchema,
        createdBy: req.user.id,
      });
      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Update job (HR/Admin only)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('formSchema').isArray().withMessage('Form schema must be an array'),
    body('status').isIn(['active', 'closed']).withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, department, description, formSchema, status } = req.body;
      const job = await Job.update(req.params.id, {
        title,
        department,
        description,
        formSchema,
        status,
      });
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Update job status only (HR/Admin only)
router.patch(
  '/:id/status',
  authenticateToken,
  authorizeRoles('admin', 'hr'),
  [body('status').isIn(['active', 'closed']).withMessage('Invalid status')],
  validate,
  async (req, res, next) => {
    try {
      const job = await Job.updateStatus(req.params.id, req.body.status);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      next(error);
    }
  }
);

// Delete job (Admin only)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res, next) => {
    try {
      await Job.delete(req.params.id);
      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
