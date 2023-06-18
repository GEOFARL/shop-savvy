const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const shopRouter = express.Router();

shopRouter.get('/', (req, res, next) => {
  res.render('shop');
});

module.exports = shopRouter;
