const path = require('path');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const db = require('./util/database');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

// const expressHbs = require('express-handlebars').engine;

// const { mongoConnect } = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { get404 } = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dd2jder.mongodb.net/?retryWrites=true&dbName=shop&w=majority`,
  collection: 'sessions',
});

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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    // cookie: {
    //   maxAge: 15000, // Set the session duration to 15 seconds
    // },
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((e) => console.log(e));
  } else {
    next();
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/', get404);

// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: 'Max', email: 'toper.one11@gmail.com' });
//     }
//     return Promise.resolve(user);
//   })
//   .then((user) => {
//     return user.createCart();
//     // return User.findOrCreate({
//     //   where: {
//     //     id: 1,
//     //   },
//     //   include: [Cart],
//     // });
//   })
//   .then(() => {
//     app.listen(3000);
//   })
//   .catch((e) => console.log(e));

// mongoConnect(() => {
//   app.listen(3000);
//   const max = new User('geofarl', 'toper.one11@gmail.com', { items: [] });
//   max
//     .save()
//     // .then((document) => {
//     //   return User.findById(document.value._id).toArray();
//     // })
//     // .then((user) => console.log(user))
//     .catch((e) => console.log(e));
// });

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dd2jder.mongodb.net/?retryWrites=true&dbName=shop&w=majority`;

mongoose
  .connect(uri)
  .then((result) => {
    // User.findOne({ email: 'geofarl345m@gmail.com' })
    //   .then((result) => {
    //     if (!result) {
    //       const user = new User({
    //         password: '123456',
    //         email: 'geofarl345m@gmail.com',
    //         cart: {
    //           items: [],
    //         },
    //       });

    //       user.save().catch((saveError) => {
    //         console.error('Error saving document:', saveError);
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error finding document:', error);
    //   });
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// app.listen(3000);
