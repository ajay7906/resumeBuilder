// ./routes/authRoutes.js
const express = require('express');
// const { register, login } = require('../controllers/authControllers');
const router = express.Router();

//rate limiter
const rateLimit = require('express-rate-limit');
const { register, login, refreshToken, logout } = require('../controllers/authControllers');
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
})

// example route
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', authLimiter, refreshToken);
router.post('/logout', authLimiter, logout);
// router.post('/api/auth/forgot-password', authLimiter, forgotPassword);
// router.post('/api/auth/reset-password', authLimiter, resetPassword);
// router.post('/api/auth/verify-email', authLimiter, verifyEmail);
// router.post('/api/auth/verify-phone', authLimiter, verifyPhone);
// router.post('/api/auth/verify-otp', authLimiter, verifyOtp);
// router.post('/api/auth/verify-otp/resend', authLimiter, resendOtp);

// router.post('/api/auth/logout', authLimiter, logout);

// router.post('/api/auth/verify-email', authLimiter, verifyEmail);
// router.post('/api/auth/verify-phone', authLimiter, verifyPhone);
// import passport from 'passport';
const passport = require('passport');

// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
const {Strategy: GoogleStrategy} = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 'oauthProviders.providerId': profile.id });
      
      if (!user) {
        user = await User.create({
          email: profile.emails[0].value,
          oauthProviders: [{
            provider: 'google',
            providerId: profile.id
          }]
        });
      }
      
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

// Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    setTokenCookies(res, accessToken, refreshToken);
    res.redirect('/');
  }
);





module.exports = router;
