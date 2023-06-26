const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render('shop/product-list', {
  //     products,
  //     docTitle: 'Shop',
  //     path: '/products',
  //   });
  // });
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        products: rows,
        docTitle: 'Shop',
        path: '/products',
      });
    })
    .catch((e) => console.log(e));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findById(prodId, (product) => {
  //   res.render('shop/product-detail', {
  //     product,
  //     docTitle: product.title,
  //     path: '/products',
  //   });
  // });
  Product.findById(prodId)
    .then(([data]) => {
      res.render('shop/product-detail', {
        product: data[0],
        docTitle: data[0].title,
        path: '/products',
      });
    })
    .catch((e) => console.log(e));
};

exports.getIndex = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render('shop/index', {
  //     products,
  //     docTitle: 'All Products',
  //     path: '/',
  //   });
  // });
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        products: rows,
        docTitle: 'All Products',
        path: '/',
      });
    })
    .catch((e) => console.log(e));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    docTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    docTitle: 'Checkout',
  });
};
