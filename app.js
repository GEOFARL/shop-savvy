const path = require('path');

const express = require('express');
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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', get404);

app.listen(3000);
