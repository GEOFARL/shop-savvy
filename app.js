const path = require('path');

const express = require('express');
const expressHbs = require('express-handlebars').engine;

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.engine('hbs', expressHbs());
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: 'true' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use('/', (req, res, next) => {
  res.status(404).render('404', { docTitle: 'Page not Found', layout: false });
});

app.listen(3000);
