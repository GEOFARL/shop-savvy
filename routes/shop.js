const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const shopRouter = express.Router();

shopRouter.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', {
    products,
    docTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = shopRouter;
