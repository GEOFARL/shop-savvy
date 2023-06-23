const path = require('path');

const express = require('express');

const {
  getIndex,
  getProducts,
  getCart,
  getCheckout,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/cart', getCart);
shopRouter.get('/checkout', getCheckout);

module.exports = shopRouter;
