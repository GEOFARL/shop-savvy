const Product = require('../models/product');
const { validationResult } = require('express-validator');

// @desc    Get a page for adding a new product
// @route   GET /signup
// @access  Private
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: req.flash('error'),
    oldInputs: { title: '', imageUrl: '', price: '', description: '' },
    validationErrors: [],
  });
};

// @desc    Add a new product
// @route   POST /admin/add-product
// @access  Private
exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      docTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg,
      oldInputs: { title, imageUrl, price, description },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect('/');
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// @desc    Get a page for editing the product
// @route   GET /admin/edit-product/:productId
// @access  Private
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: req.flash('error'),
        oldInputs: { title: '', imageUrl: '', price: '', description: '' },
        validationErrors: [],
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// @desc    Edit the product
// @route   POST /admin/edit-product/
// @access  Private
exports.postEditProduct = (req, res, next) => {
  const { title, price, imageUrl, description, productId } = req.body;

  const errors = validationResult(req);

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }

      if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
          docTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: true,
          product: product,
          errorMessage: errors.array()[0].msg,
          oldInputs: { title, imageUrl, price, description },
          validationErrors: errors.array(),
        });
      }

      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save().then((result) => {
        res.redirect('/admin/products');
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// @desc    Get a page with all of the admin products
// @route   GET /admin/products
// @access  Private
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render('admin/products', {
        products: products,
        docTitle: 'Shop',
        path: '/admin/products',
      });
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// @desc    Delete a product
// @route   DELETE /admin/delete-product
// @access  Private
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((e) => {
      const error = new Error(e);
      error.httpStatusCode = 500;
      return next(error);
    });
};
