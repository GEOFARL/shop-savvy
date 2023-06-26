// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart');

const db = require('../util/database');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'products.json'
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       return cb([]);
//     }
//     cb(JSON.parse(fileContent));
//   });
// };

module.exports = class Product {
  constructor(title, imageUrl, price, description, id = null) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  // save() {
  //   getProductsFromFile((products) => {
  //     if (!this.id) {
  //       this.id = Math.random().toString();
  //       products.push(this);
  //       fs.writeFile(p, JSON.stringify(products), (err) => {
  //         console.log(err);
  //       });
  //     } else {
  //       const existingProductIndex = products.findIndex(
  //         (prod) => prod.id === this.id
  //       );
  //       const updatedProducts = [...products];
  //       updatedProducts[existingProductIndex] = this;
  //       fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
  //         console.log(err);
  //       });
  //     }
  //   });
  // }

  save() {
    return db.execute(
      'INSERT INTO Products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  // static fetchAll(cb) {
  //   getProductsFromFile(cb);
  // }

  static fetchAll() {
    return db.execute('SELECT * FROM Products');
  }

  // static findById(id, cb) {
  //   getProductsFromFile((products) => {
  //     const product = products.find((p) => p.id === id);
  //     cb(product);
  //   });
  // }

  static findById(id) {
    return db.execute('SELECT * FROM Products WHERE products.id = ?', [id]);
  }
  // static deleteById(id) {
  //   getProductsFromFile((products) => {
  //     const product = products.find((prod) => prod.id === id);
  //     const updatedProducts = products.filter((prod) => prod.id !== id);
  //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
  //       if (!err) {
  //         Cart.deleteProduct(id, product.price);
  //       }
  //     });
  //   });
  // }
};
