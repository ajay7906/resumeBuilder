// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Store refresh token in DB
    await User.findByIdAndUpdate(user._id, {
      $push: { 
        refreshTokens: { 
          token: refreshToken,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      }
    });
    
    setTokenCookies(res, accessToken, refreshToken);
    
    res.status(201).json({ 
      user: { id: user._id, email: user.email },
      accessToken
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
    
    // Account lock check
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({ error: 'Account temporarily locked' });
    }
    
    if (!user || !(await user.comparePassword(password))) {
      // Increment failed attempts
      await User.findByIdAndUpdate(user?._id, {
        $inc: { loginAttempts: 1 },
        ...(user?.loginAttempts + 1 >= 5 ? { 
          lockUntil: new Date(Date.now() + 30 * 60 * 1000) // 30 min lock
        } : {})
      });
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Reset login attempts on success
    await User.findByIdAndUpdate(user._id, {
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: new Date()
    });
    
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Store refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { 
        refreshTokens: { 
          token: refreshToken,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    
    setTokenCookies(res, accessToken, refreshToken);
    
    res.json({ 
      user: { id: user._id, email: user.email },
      accessToken
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}