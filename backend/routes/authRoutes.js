// ./routes/authRoutes.js
const express = require('express');
// const { register, login } = require('../controllers/authControllers');
const router = express.Router();

//rate limiter
const rateLimit  = require('express-rate-limit');
const { register, login } = require('../controllers/authControllers');
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
})

// example route
router.post('/api/auth/register', authLimiter, register);
router.post('/api/auth/login', authLimiter,  login);

module.exports = router;
