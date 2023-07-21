const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.EMAIL_API_KEY,
    },
  })
);

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    errorMessage: req.flash('error'),
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/signup');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash('error', 'User with this email already exists');
        return res.redirect('/signup');
      }
      return bcryptjs
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
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    errorMessage: req.flash('error'),
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true');

  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }

      bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              res.redirect('/');
            });
          } else {
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch((e) => console.log(e));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    docTitle: 'Reset Password',
    errorMessage: req.flash('error'),
  });
};

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
      .catch((err) => console.log(err));
  });
};

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
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const { password: newPassword, userId, passwordToken } = req.body;
  let resetUser;

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
    .catch((err) => console.log(err));
};
