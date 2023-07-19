const bcryptjs = require('bcryptjs');
const User = require('../models/user');

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
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
        .then(() => res.redirect('/login'));
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
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true');

  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
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
