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
  postCartDeleteProduct,
  postOrder,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
// shopRouter.get('/products/:productId', getProduct);
// shopRouter.get('/cart', getCart);
// shopRouter.post('/cart', postCart);
// shopRouter.post('/cart-delete-item', postCartDeleteProduct);
// shopRouter.post('/create-order', postOrder);
// shopRouter.get('/orders', getOrders);
// shopRouter.get('/checkout', getCheckout);

module.exports = shopRouter;
