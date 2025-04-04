// ./routes/authRoutes.js
const express = require('express');
const router = express.Router();

// example route
router.post('/login', (req, res) => {
  res.send('Login route');
});

module.exports = router;
