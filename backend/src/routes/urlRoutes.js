import express from 'express';
import { body } from 'express-validator';
import {
  createShortUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  createBulkUrls,
} from '../controllers/urlController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation schema for creating/updating URLs
const urlValidation = [
  body('originalUrl', 'Please enter a valid URL')
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
    })
    .trim(),
  body('customAlias')
    .optional({ checkFalsy: true })
    // Allow alphanumeric plus - and _ for nicer aliases
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage('Custom alias may only contain letters, numbers, hyphens and underscores')
    .isLength({ min: 3, max: 30 })
    .withMessage('Custom alias must be between 3 and 30 characters')
    .trim(),
  body('expiresAt')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Expiration must be a valid date'),
];

router.route('/bulk')
  .post(protect, createBulkUrls);

router.route('/')
  .post(protect, urlValidation, createShortUrl)
  .get(protect, getUrls);

router.route('/:id')
  .get(protect, getUrlById)
  .put(protect, urlValidation, updateUrl)
  .delete(protect, deleteUrl);

export default router;
