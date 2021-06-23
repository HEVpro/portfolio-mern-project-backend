const User = require('../models/Users');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Catch email and password
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    // Validate if email exists
    if (user) {
      return res.status(400).json({ msg: 'This user already exists.' });
    }
    //Create user
    user = new User(req.body);

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    //Save user
    await user.save();

    // Create JWT
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
  } catch (err) {
    console.log(err);
    res.status(400).send('Something was wrong!');
  }
};
