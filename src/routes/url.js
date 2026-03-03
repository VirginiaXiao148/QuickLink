const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { createShortUrl, redirectToOriginal, getUrlStats } = require('../controllers/urlController');
const validateUrl = require('../middleware/validateUrl');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/urls — create a short URL
router.post('/', limiter, validateUrl, createShortUrl);

// GET /:shortCode/stats — get click stats for a short URL
router.get('/:shortCode/stats', limiter, getUrlStats);

// GET /:shortCode — redirect to the original URL
router.get('/:shortCode', limiter, redirectToOriginal);

module.exports = router;
