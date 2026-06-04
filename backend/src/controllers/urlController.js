import Url from '../models/Url.js';
import Visit from '../models/Visit.js';
import generateShortCode from '../utils/generateShortCode.js';
import { validationResult } from 'express-validator';
import UAParser from 'ua-parser-js';
import bcrypt from 'bcryptjs';

// @desc    Create a short URL
// @route   POST /api/urls
// @access  Private
export const createShortUrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { originalUrl, customAlias, expiresAt, password } = req.body;
    const userId = req.user._id;

    // Check custom alias if provided
    if (customAlias) {
      const aliasExists = await Url.findOne({
        $or: [{ customAlias }, { shortCode: customAlias }],
      });
      if (aliasExists) {
        return res.status(400).json({ message: 'Custom alias or short code already in use' });
      }
    }

    // Generate a unique short code
    let shortCode;
    let codeExists = true;
    let attempts = 0;

    while (codeExists && attempts < 10) {
      shortCode = generateShortCode();
      const existing = await Url.findOne({
        $or: [{ shortCode }, { customAlias: shortCode }],
      });
      if (!existing) {
        codeExists = false;
      }
      attempts++;
    }

    if (codeExists) {
      res.status(500);
      throw new Error('Failed to generate a unique short code. Please try again.');
    }

    const urlData = {
      userId,
      originalUrl,
      shortCode,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    };

    if (customAlias) {
      urlData.customAlias = customAlias;
    }

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      urlData.password = await bcrypt.hash(password, salt);
      urlData.isPasswordProtected = true;
    }

    const url = await Url.create(urlData);

    res.status(201).json(url);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all URLs for a user
// @route   GET /api/urls
// @access  Private
export const getUrls = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { userId };
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { customAlias: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sorting
    let sortOptions = {};
    const field = sortBy || 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortOptions[field] = order;

    // Pagination setup
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch data
    const total = await Url.countDocuments(query);
    const urls = await Url.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      urls,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get URL by ID
// @route   GET /api/urls/:id
// @access  Private
export const getUrlById = async (req, res, next) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    res.json(url);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a URL
// @route   PUT /api/urls/:id
// @access  Private
export const updateUrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { originalUrl, customAlias, expiresAt, isActive, password } = req.body;
    const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Check alias conflict if changed
    if (customAlias && customAlias !== url.customAlias) {
      const aliasExists = await Url.findOne({
        $or: [{ customAlias }, { shortCode: customAlias }],
        _id: { $ne: url._id },
      });
      if (aliasExists) {
        return res.status(400).json({ message: 'Custom alias or short code already in use' });
      }
      url.customAlias = customAlias;
    } else if (customAlias === '') {
      // Remove alias
      url.customAlias = undefined;
    }

    if (originalUrl !== undefined) url.originalUrl = originalUrl;
    if (expiresAt !== undefined) url.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) url.isActive = isActive;

    // Handle password update
    if (password !== undefined) {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        url.password = await bcrypt.hash(password, salt);
        url.isPasswordProtected = true;
      } else {
        url.password = null;
        url.isPasswordProtected = false;
      }
    }

    const updatedUrl = await url.save();
    res.json(updatedUrl);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a URL
// @route   DELETE /api/urls/:id
// @access  Private
export const deleteUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, userId: req.user._id });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Delete associated visits
    await Visit.deleteMany({ urlId: url._id });
    
    // Delete URL
    await Url.deleteOne({ _id: url._id });

    res.json({ message: 'URL and associated analytics deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Redirect to original URL & record analytics
// @route   GET /:shortCode
// @access  Public
export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const { password } = req.body || {};

    // Find URL by shortCode or customAlias
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
    });

    if (!url) {
      return res.status(404).send('<h1>URL Not Found</h1><p>The short link you are trying to access does not exist.</p>');
    }

    // Check if active
    if (!url.isActive) {
      return res.status(400).send('<h1>Link Inactive</h1><p>This short link is currently inactive.</p>');
    }

    // Check expiration
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(400).send('<h1>Link Expired</h1><p>This short link has expired.</p>');
    }

    // Handle Password Protection
    if (url.isPasswordProtected) {
      if (!password) {
        return res.send(getPasswordPageHTML(shortCode, false));
      }
      
      const isMatch = await url.comparePassword(password);
      if (!isMatch) {
        return res.send(getPasswordPageHTML(shortCode, true));
      }
    }

    // Increment click count
    url.clickCount += 1;
    await url.save();

    // Parse User-Agent
    const ua = req.headers['user-agent'] || '';
    const parser = new UAParser(ua);
    const uaResult = parser.getResult();

    const browser = uaResult.browser.name || 'Unknown';
    const os = uaResult.os.name || 'Unknown';
    const deviceType = uaResult.device.type || 'Desktop';
    // Capitalize device type
    const device = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);

    // Get IP
    const ipAddress =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      'Unknown';

    // Save visit analytics
    await Visit.create({
      urlId: url._id,
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress.split(',')[0].trim(),
      browser,
      os,
      device,
    });

    // Server-side redirect
    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

// Helper function to render a gorgeous password prompt HTML page
const getPasswordPageHTML = (shortCode, hasError) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Protected Link - LinkShrink</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;850&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(15, 23, 42, 0.6);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #06b6d4;
      --primary-hover: #0891b2;
      --error: #ef4444;
    }
    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f8fafc;
        --card-bg: rgba(255, 255, 255, 0.85);
        --card-border: rgba(0, 0, 0, 0.08);
        --text: #0f172a;
        --text-muted: #64748b;
        --primary: #0891b2;
        --primary-hover: #0e7490;
      }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
    }
    body {
      background: var(--bg);
      color: var(--text);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
      position: relative;
    }
    .glow-1 {
      position: absolute;
      top: -10%;
      left: -10%;
      width: 50vw;
      height: 50vw;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
      z-index: 1;
      pointer-events: none;
    }
    .glow-2 {
      position: absolute;
      bottom: -10%;
      right: -10%;
      width: 50vw;
      height: 50vw;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%);
      z-index: 1;
      pointer-events: none;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(24px);
      border-radius: 24px;
      padding: 40px;
      width: 90%;
      max-width: 440px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
      z-index: 10;
      animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .logo-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #06b6d4 0%, #0d9488 100%);
      margin-bottom: 24px;
      box-shadow: 0 8px 16px rgba(6, 182, 212, 0.2);
    }
    .logo-icon {
      width: 32px;
      height: 32px;
      fill: none;
      stroke: white;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    h1 {
      font-size: 24px;
      font-weight: 850;
      margin-bottom: 8px;
    }
    p {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 32px;
      line-height: 1.5;
    }
    .form-group {
      margin-bottom: 24px;
      text-align: left;
    }
    label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    input[type="password"] {
      width: 100%;
      padding: 14px 16px;
      border-radius: 12px;
      border: 2px solid var(--card-border);
      background: rgba(0,0,0,0.05);
      color: var(--text);
      font-size: 16px;
      outline: none;
      transition: all 0.3s;
    }
    input[type="password"]:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.15);
    }
    .btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(90deg, #06b6d4 0%, #0d9488 100%);
      color: white;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
      transition: all 0.3s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
    }
    .btn:active {
      transform: translateY(0);
    }
    .error-msg {
      color: var(--error);
      font-size: 13px;
      font-weight: 600;
      margin-top: 16px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      animation: shake 0.4s ease-in-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }
  </style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="card">
    <div class="logo-container">
      <svg class="logo-icon" viewBox="0 0 24 24">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L21 2" />
        <path d="M17 7l3.5 3.5" />
      </svg>
    </div>
    <h1>Link Protected</h1>
    <p>This shortened link requires a password to redirect you to the destination URL.</p>
    <form method="POST" action="/${shortCode}">
      <div class="form-group">
        <label for="password">Enter Password</label>
        <input type="password" id="password" name="password" placeholder="••••••••" required autofocus>
      </div>
      <button type="submit" class="btn">Verify & Proceed</button>
      ${hasError ? `<div class="error-msg">Incorrect password. Please try again.</div>` : ''}
    </form>
  </div>
</body>
</html>`;
};

// @desc    Create bulk URLs
// @route   POST /api/urls/bulk
// @access  Private
export const createBulkUrls = async (req, res, next) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of URLs to shorten' });
    }

    const userId = req.user._id;
    const results = [];
    const errors = [];

    // Simple URL regex validator (similar to express-validator's isURL)
    const isValidUrl = (str) => {
      try {
        const parsed = new URL(str);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (_) {
        return false;
      }
    };

    // Alias regex: letters, numbers, hyphens and underscores
    const aliasRegex = /^[A-Za-z0-9_-]{3,30}$/;

    // Pre-validate all URLs
    for (let i = 0; i < urls.length; i++) {
      const { originalUrl, customAlias, expiresAt } = urls[i];
      const rowNum = i + 1;

      if (!originalUrl) {
        errors.push(`Row ${rowNum}: Destination URL is required.`);
        continue;
      }

      if (!isValidUrl(originalUrl)) {
        errors.push(`Row ${rowNum}: Invalid URL format. Must start with http:// or https://.`);
        continue;
      }

      if (customAlias) {
        const trimmedAlias = customAlias.trim();
        if (!aliasRegex.test(trimmedAlias)) {
          errors.push(`Row ${rowNum}: Alias "${trimmedAlias}" must be 3-30 characters containing only letters, numbers, hyphens, and underscores.`);
          continue;
        }

        // Check if alias is already taken (either in db or duplicate in this batch)
        const aliasExists = await Url.findOne({
          $or: [{ customAlias: trimmedAlias }, { shortCode: trimmedAlias }],
        });
        if (aliasExists) {
          errors.push(`Row ${rowNum}: Alias "${trimmedAlias}" is already in use.`);
          continue;
        }

        const duplicateInBatch = urls.some((u, idx) => idx !== i && u.customAlias && u.customAlias.trim() === trimmedAlias);
        if (duplicateInBatch) {
          errors.push(`Row ${rowNum}: Duplicate alias "${trimmedAlias}" in the upload batch.`);
          continue;
        }
      }

      if (expiresAt) {
        const date = new Date(expiresAt);
        if (isNaN(date.getTime())) {
          errors.push(`Row ${rowNum}: Invalid expiration date.`);
          continue;
        }
        if (date < new Date()) {
          errors.push(`Row ${rowNum}: Expiration date must be in the future.`);
          continue;
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Process creation
    for (const urlItem of urls) {
      const { originalUrl, customAlias, expiresAt, password } = urlItem;

      // Generate a unique short code
      let shortCode;
      let codeExists = true;
      let attempts = 0;

      while (codeExists && attempts < 10) {
        shortCode = generateShortCode();
        const existing = await Url.findOne({
          $or: [{ shortCode }, { customAlias: shortCode }],
        });
        if (!existing) {
          codeExists = false;
        }
        attempts++;
      }

      if (codeExists) {
        throw new Error('Failed to generate a unique short code for a URL. Please try again.');
      }

      const urlData = {
        userId,
        originalUrl,
        shortCode,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      };

      if (customAlias) {
        urlData.customAlias = customAlias.trim();
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        urlData.password = await bcrypt.hash(password, salt);
        urlData.isPasswordProtected = true;
      }

      const createdUrl = await Url.create(urlData);
      results.push(createdUrl);
    }

    res.status(201).json(results);
  } catch (error) {
    next(error);
  }
};
