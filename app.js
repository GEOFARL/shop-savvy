const path = require('path');
require('dotenv').config();

const express = require('express');
// const db = require('./util/database');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');

// const expressHbs = require('express-handlebars').engine;

const { mongoConnect } = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const User = require('./models/user');

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
  User.findById('64a3e82ccad39584d0d7d2bb')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => console.log(e));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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

mongoConnect(() => {
  app.listen(3000);
  const max = new User('geofarl', 'toper.one11@gmail.com');
  max
    .save()
    // .then((document) => {
    //   return User.findById(document.value._id).toArray();
    // })
    // .then((user) => console.log(user))
    .catch((e) => console.log(e));
});

// app.listen(3000);
