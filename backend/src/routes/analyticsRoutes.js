import express from 'express';
import { getUrlAnalytics, getDashboardSummary } from '../controllers/analyticsController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// General dashboard analytics summary
router.get('/dashboard/summary', protect, getDashboardSummary);

// Specific URL analytics
router.get('/:id', protect, getUrlAnalytics);

export default router;
