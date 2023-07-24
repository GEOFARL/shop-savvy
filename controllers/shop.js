const Product = require('../models/product');
const Order = require('../models/order');

// @desc    Get products page
// @route   GET /products
// @access  Public
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        products: products,
        docTitle: 'Products',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};

// @desc    Get a specific product page
// @route   GET /products/:productId
// @access  Public
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        docTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};

// @desc    Get home page
// @route   GET /
// @access  Public
exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        products: products,
        docTitle: 'All Products',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};

// @desc    Get a user's cart page
// @route   GET /cart
// @access  Private
exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      console.log(products);
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};

// @desc    Add a product to the cart
// @route   POST /cart
// @access  Private
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      req.user.addToCart(product);
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};

// @desc    Delete a product from the cart
// @route   POST /cart-delete-item
// @access  Private
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};

// @desc    Create a new order
// @route   POST /create-order
// @access  Private
exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: i.productId.toObject() };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};

// @desc    Get a page with user's orders
// @route   GET /orders
// @access  Private
exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).redirect('/500');
    });
};
