const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render('shop/product-list', {
  //     products,
  //     docTitle: 'Shop',
  //     path: '/products',
  //   });
  // });
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render('shop/product-list', {
  //       products: rows,
  //       docTitle: 'Shop',
  //       path: '/products',
  //     });
  //   })
  //   .catch((e) => console.log(e));
  // Product.findAll()
  //   .then((products) => {
  //     res.render('shop/product-list', {
  //       products: products,
  //       docTitle: 'Shop',
  //       path: '/products',
  //     });
  //   })
  //   .catch((e) => console.log(e));

  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        products: products,
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
  // Product.findById(prodId)
  //   .then(([data]) => {
  //     res.render('shop/product-detail', {
  //       product: data[0],
  //       docTitle: data[0].title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((e) => console.log(e));
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       docTitle: product.title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((e) => console.log(e));

  // ALTERNATIVE WAY
  // Product.findAll({
  //   where: {
  //     id: prodId,
  //   },
  // })
  //   .then(([product]) => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       docTitle: product.title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((e) => console.log(e));

  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        docTitle: product.title,
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
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render('shop/index', {
  //       products: rows,
  //       docTitle: 'All Products',
  //       path: '/',
  //     });
  //   })
  //   .catch((e) => console.log(e));

  // Product.findAll()
  //   .then((products) => {
  //     res.render('shop/index', {
  //       products: products,
  //       docTitle: 'All Products',
  //       path: '/',
  //     });
  //   })
  //   .catch((e) => console.log(e));

  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        products: products,
        docTitle: 'All Products',
        path: '/',
      });
    })
    .catch((e) => console.log(e));
};

exports.getCart = (req, res, next) => {
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       docTitle: 'Your Cart',
  //       products: products,
  //     });
  //   })
  //   .catch((e) => console.log(e));
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((e) => console.log(e));
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       docTitle: 'Your Cart',
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect('/cart'));

  // Product.findById(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect('/cart');

  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product = null;
  //     if (products.length > 0) {
  //       [product] = products;
  //     }

  //     let newQuantity = 1;
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return fetchedCart.addProduct(product, {
  //         through: { quantity: newQuantity },
  //       });
  //     }

  //     return Product.findByPk(prodId)
  //       .then((product) => {
  //         return fetchedCart.addProduct(product, {
  //           through: { quantity: newQuantity },
  //         });
  //       })
  //       .catch((e) => console.log(e));
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch((e) => console.log(e));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect('/cart');
  // });
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.getProducts({
  //       where: {
  //         id: prodId,
  //       },
  //     });
  //   })
  //   .then(([product]) => {
  //     return product.cartItem.destroy();
  //   })
  //   .then((result) => {
  //     res.redirect('/cart');
  //   })
  //   .catch((e) => console.log(e));

  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((e) => console.log(e));
};

exports.postOrder = (req, res, next) => {
  // let fetchedCart;
  // req.user
  // .getCart()
  // .then((cart) => {
  //   fetchedCart = cart;
  //   return cart.getProducts();
  // })
  // .then((products) => {
  //   return req.user
  //     .createOrder()
  //     .then((order) => {
  //       return order.addProducts(
  //         products.map((product) => {
  //           console.log(product);
  //           product.orderItem = { quantity: product.cartItem.quantity };
  //           return product;
  //         })
  //       );
  //     })
  //     .catch((e) => console.log(e));
  // })
  // .then(() => {
  //   return fetchedCart.setProducts(null);
  // })
  // .then(() => {
  //   res.redirect('/products');
  // })
  // .catch((e) => console.log(e));

  req.user
    .addOrder()
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        docTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((e) => console.log(e));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    docTitle: 'Checkout',
  });
};
