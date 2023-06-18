const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const shopRouter = express.Router();

shopRouter.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', { products, docTitle: 'Shop' });
});

module.exports = shopRouter;
