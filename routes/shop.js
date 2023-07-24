const path = require('path');

const express = require('express');

const isAuth = require('../middleware/is-auth');

const {
  getIndex,
  getProducts,
  getCart,
  postCart,
  getOrders,
  getProduct,
  postCartDeleteProduct,
  postOrder,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProduct);
shopRouter.get('/cart', isAuth, getCart);
shopRouter.post('/cart', isAuth, postCart);
shopRouter.post('/cart-delete-item', isAuth, postCartDeleteProduct);
shopRouter.post('/create-order', isAuth, postOrder);
shopRouter.get('/orders', isAuth, getOrders);

module.exports = shopRouter;
