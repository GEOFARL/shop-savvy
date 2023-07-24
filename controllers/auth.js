const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.EMAIL_API_KEY,
    },
  })
);

// @desc    Get a signup page
// @route   GET /signup
// @access  Public
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    errorMessage: req.flash('error'),
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

// @desc    Sign up a new user
// @route   POST /signup
// @access  Public
exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      docTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }
  bcryptjs
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: {
          items: [],
        },
      });

      return newUser.save();
    })
    .then(() => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Signup succeeded',
        html: '<h1>You successfully signed up</h1>',
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// @desc    Get a login page
// @route   GET /login
// @access  Public
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    errorMessage: req.flash('error'),
    oldInput: { email: '', password: '' },
    validationErrors: [],
  });
};

// @desc    Login a user
// @route   POST /login
// @access  Public
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      docTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email })
    .then((user) => {
      bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              if (err) {
                console.log(err);
                return res.redirect('/500');
              }
              res.redirect('/');
            });
          } else {
            req.flash('error', 'Invalid email or password');
            res.render('auth/login', {
              path: '/login',
              docTitle: 'Login',
              errorMessage: req.flash('error'),
              oldInput: { email, password },
              validationErrors: [{ param: 'email' }, { param: 'password' }],
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.render('auth/login', {
            path: '/login',
            docTitle: 'Login',
            errorMessage: req.flash('error'),
            oldInput: { email, password },
            validationErrors: [{ param: 'email' }, { param: 'password' }],
          });
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// @desc    Logout a user
// @route   POST /logout
// @access  Private
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  });
};

// @desc    Get a reset password page
// @route   GET /reset
// @access  Public
exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    docTitle: 'Reset Password',
    errorMessage: req.flash('error'),
    validationErrors: [],
  });
};

// @desc    Reset a user's password
// @route   POST /reset
// @access  Public
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1 * 60 * 60 * 1000;
        return user.save().then(() => {
          res.redirect('/');
          transporter.sendMail({
            to: req.body.email,
            from: process.env.SENDER_EMAIL,
            subject: 'Password reset',
            html: `<p>You requested password reset</p>
          <p>Click this <a href="${process.env.HOST}/reset/${token}">link</a> to set a new password</p>`,
          });
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

// @desc    Get a page for entering a new password
// @route   GET /reset/:token
// @access  Public
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      res.render('auth/new-password', {
        path: '/new-password',
        docTitle: 'New Password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: token,
        oldInput: { password: '' },
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// @desc    Submit a new user password
// @route   POST /new-password
// @access  Public
exports.postNewPassword = (req, res, next) => {
  const { password: newPassword, userId, passwordToken } = req.body;
  let resetUser;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/new-password', {
      path: '/new-password',
      docTitle: 'New Password',
      errorMessage: errors.array()[0].msg,
      userId,
      passwordToken,
      oldInput: { password: newPassword },
      validationErrors: errors.array(),
    });
  }

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcryptjs.hash(newPassword, 10);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
