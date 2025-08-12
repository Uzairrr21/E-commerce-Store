const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  createAdminUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
});

router.post('/login', authLimiter, authUser);
router.route('/').post(authLimiter, registerUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); // Added PUT route for profile updates
router.route('/admin').post(protect, admin, createAdminUser);

module.exports = router;