const path = require('path');
require('dotenv').config();

const express = require('express');
// const db = require('./util/database');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

// const expressHbs = require('express-handlebars').engine;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');

const app = express();

// app.engine(
//   'hbs',
//   expressHbs({
//     defaultLayout: 'main-layout',
//     layoutsDir: 'views/layouts/',
//     extname: 'hbs',
//   })
// );
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: 'true' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => console.log(e));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Max', email: 'toper.one11@gmail.com' });
    }
    return Promise.resolve(user);
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));

// app.listen(3000);
