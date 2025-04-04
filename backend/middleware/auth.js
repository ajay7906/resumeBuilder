// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Check for access token in cookies
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Attach user to request
    req.user = await User.findById(decoded.id).select('-password -refreshTokens');
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return refreshToken(req, res, next);
    }
    res.status(401).json({ error: 'Not authenticated' });
  }
};

async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: 'Not authenticated' });

    // Find user with this refresh token
    const user = await User.findOne({ 
      'refreshTokens.token': refreshToken,
      'refreshTokens.expires': { $gt: new Date() }
    });
    
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Update refresh token in DB
    await User.updateOne(
      { _id: user._id, 'refreshTokens.token': refreshToken },
      { 
        $set: { 
          'refreshTokens.$.token': newRefreshToken,
          'refreshTokens.$.expires': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        } 
      }
    );

    setTokenCookies(res, accessToken, newRefreshToken);
    
    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authenticated' });
  }
}