const path = require('path');

const express = require('express');

const { getProducts } = require('../controllers/products');

const shopRouter = express.Router();

shopRouter.get('/', getProducts);

module.exports = shopRouter;
