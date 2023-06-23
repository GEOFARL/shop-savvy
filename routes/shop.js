const path = require('path');

const express = require('express');

const {
  getIndex,
  getProducts,
  getCart,
  postCart,
  getCheckout,
  getOrders,
  getProduct,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProduct);
shopRouter.get('/cart', getCart);
shopRouter.post('/cart', postCart);
shopRouter.get('/orders', getOrders);
shopRouter.get('/checkout', getCheckout);

module.exports = shopRouter;
