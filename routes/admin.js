const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', isAuth, getAddProduct);
router.get('/products', isAuth, getProducts);

router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage('Title should be at least 3 characters long'),
    body('imageUrl').isURL().withMessage('Invalid URL'),
    body('price').isFloat().withMessage('Price should be a float number'),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage(
        'Description should be at least 5 characters long and not more than 400 characters'
      ),
  ],
  isAuth,
  postAddProduct
);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage('Title should be at least 3 characters long'),
    body('imageUrl').isURL().withMessage('Invalid URL'),
    body('price').isFloat().withMessage('Price should be a float number'),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage(
        'Description should be at least 5 characters long and not more than 400 characters'
      ),
  ],
  isAuth,
  postEditProduct
);

router.post('/delete-product', isAuth, postDeleteProduct);

module.exports = router;
