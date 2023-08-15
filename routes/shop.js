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
  getInvoice,
  getCheckout,
  getCheckoutSuccess,
} = require('../controllers/shop');

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProduct);
shopRouter.get('/cart', isAuth, getCart);
shopRouter.post('/cart', isAuth, postCart);
shopRouter.post('/cart-delete-item', isAuth, postCartDeleteProduct);
shopRouter.get('/checkout', isAuth, getCheckout);
shopRouter.get('/checkout/success', getCheckoutSuccess);
shopRouter.get('/checkout/cancel', getCheckout);
shopRouter.get('/orders', isAuth, getOrders);
shopRouter.get('/orders/:orderId', isAuth, getInvoice);

module.exports = shopRouter;
