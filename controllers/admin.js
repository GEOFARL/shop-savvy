const Product = require('../models/product');
const { ObjectId } = require('mongodb');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    docTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({ title, price, description, imageUrl });
  product
    .save()
    .then((result) => {
      res.redirect('/');
    })
    .catch((e) => console.log(e));
  // req.user
  //   .createProduct({
  //     title,
  //     price,
  //     imageUrl,
  //     description,
  //   })
  //   .then((result) => {
  //     // console.log(result);
  //     res.redirect('/');
  //   })
  //   .catch((e) => console.log(e));
  // const product = new Product(title, imageUrl, price, description);
  // product.save();
  // product
  //   .save()
  //   .then(() => {
  //     res.redirect('/');
  //   })
  //   .catch((e) => console.log(e));
  // res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // Product.findById(prodId, (product) => {
  //   if (!product) {
  //     return res.redirect('/');
  //   }
  //   res.render('admin/edit-product', {
  //     docTitle: 'Edit Product',
  //     path: '/admin/edit-product',
  //     editing: editMode,
  //     product,
  //   });
  // });

  // Product.findByPk(prodId)
  //   .then((product) => {
  //     if (!product) {
  //       return res.redirect('/');
  //     }
  //     res.render('admin/edit-product', {
  //       docTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode,
  //       product: product,
  //     });
  //   })
  //   .catch((e) => console.log(e));

  // req.user
  //   .getProducts({ where: { id: prodId } })
  //   .then(([product]) => {
  //     if (!product) {
  //       return res.redirect('/');
  //     }
  //     res.render('admin/edit-product', {
  //       docTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode,
  //       product: product,
  //     });
  //   })
  //   .catch((e) => console.log(e));

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
      });
    })
    .catch((e) => console.log(e));
};

exports.postEditProduct = (req, res, next) => {
  const { title, price, imageUrl, description, productId } = req.body;
  const { user } = req;
  // const updatedProduct = new Product(
  //   title,
  //   imageUrl,
  //   price,
  //   description,
  //   productId
  // );
  // updatedProduct.save();

  // Product.findByPk(productId)
  //   .then((product) => {
  //     product.title = title;
  //     product.price = price;
  //     product.description = description;
  //     product.imageUrl = imageUrl;
  //     return product.save();
  //   })
  //   .then((result) => {
  //     console.log('UPDATED PRODUCT');
  //     res.redirect('/admin/products');
  //   })
  //   .catch((e) => console.log(e));

  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    user._id,
    new ObjectId(productId)
  );

  product
    .save()
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((e) => console.log(e));

  // res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render('admin/products', {
  //     products,
  //     docTitle: 'Shop',
  //     path: '/admin/products',
  //   });
  // });

  // req.user
  //   .getProducts()
  //   .then((products) => {
  //     res.render('admin/products', {
  //       products: products,
  //       docTitle: 'Shop',
  //       path: '/admin/products',
  //     });
  //   })
  //   .catch((e) => console.log(e));

  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        products: products,
        docTitle: 'Shop',
        path: '/admin/products',
      });
    })
    .catch((e) => console.log(e));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.deleteById(prodId);
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     return product.destroy();
  //   })
  //   .then((result) => {
  //     res.redirect('/admin/products');
  //   })
  //   .catch((e) => console.log(e));
  Product.deleteById(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((e) => console.log(e));
  // res.redirect('/admin/products');
};
