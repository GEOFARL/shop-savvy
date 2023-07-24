const express = require('express');

const { check, body } = require('express-validator');
const User = require('../models/user');

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require('../controllers/auth');
const router = express.Router();

router.get('/login', getLogin);
router.post(
  '/login',
  [
    body('email')
      .isEmail({ domain_specific_validation: true })
      .withMessage('Please enter a valid email')
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject('Invalid email or password');
          }
        });
      })
      .normalizeEmail({ gmail_remove_dots: false }),
  ],
  postLogin
);
router.post('/logout', postLogout);
router.get('/signup', getSignup);
router.post(
  '/signup',
  [
    check('email')
      .isEmail({ domain_specific_validation: true })
      .withMessage('Please enter a valid email')
      .custom((value) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address is forbidden');
        // }
        // return true;
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('User with this email already exists');
          }
        });
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
  ],
  postSignup
);
router.get('/reset', getReset);
router.post('/reset', postReset);
router.get('/reset/:token', getNewPassword);
router.post(
  '/new-password',
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .trim(),
  postNewPassword
);

module.exports = router;
