const User = require('../models/Users');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Get email and password
  const { email, password } = req.body;
  try {
    // Check if the user is registered
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: 'This user does not exist!' });
    }
    // Compare passwords
    const correctPassword = await bcryptjs.compare(password, user.password);
    if (!correctPassword) {
      return res.status(400).json({ msg: 'The pasword was wrong' });
    }
    // If all is correct create JWT
    const payload = {
      user: {
        id: user.id,
      },
    };
    // Firm the token
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        // Message confirmation
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.registeredUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'There are an error!' });
  }
};
