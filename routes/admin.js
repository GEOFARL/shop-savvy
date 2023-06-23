const path = require('path');

const express = require('express');

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
} = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', getAddProduct);
router.get('/products', getProducts);

router.post('/add-product', postAddProduct);

router.get('/edit-product/:productId', getEditProduct);

module.exports = router;
