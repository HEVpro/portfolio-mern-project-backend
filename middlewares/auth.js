const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

module.exports = function (req, res, next) {
  // Read header token
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'Permission not allowed!' });
  }
  try {
    const encrypted = jwt.verify(token, process.env.SECRET);
    req.user = encrypted.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'Token incorrect!' });
  }
  // Validate token
};
