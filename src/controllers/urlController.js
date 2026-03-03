const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const createShortUrl = async (req, res) => {
  const { originalUrl, expiresAt } = req.body;
  try {
    let shortCode;
    let exists = true;
    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.exists({ shortCode });
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      shortUrl: `${BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const redirectToOriginal = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Short URL has expired' });
    }
    url.clicks += 1;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUrlStats = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    res.json({
      shortUrl: `${BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createShortUrl, redirectToOriginal, getUrlStats };
