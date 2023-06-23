const path = require('path');

const express = require('express');

const {
  getIndex,
  getProducts,
  getCart,
  getCheckout,
  getOrders,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/cart', getCart);
shopRouter.get('/orders', getOrders);
shopRouter.get('/checkout', getCheckout);

module.exports = shopRouter;
