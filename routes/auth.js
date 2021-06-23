// Routs to authenticate
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// Create user routes
//-> /api/auth
router.post('/', [
  check('email', 'Add a correct email').isEmail(),
  check('password', 'The password must be minimum of 6 characters').isLength({
    min: 6,
  }),
  authController.authenticateUser,
]);
router.get('/', auth, authController.registeredUser);
module.exports = router;
