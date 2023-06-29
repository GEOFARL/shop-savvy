// // const fs = require('fs');
// // const path = require('path');
// // const Cart = require('./cart');

// const db = require('../util/database');

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   'data',
// //   'products.json'
// // );

// // const getProductsFromFile = (cb) => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       return cb([]);
// //     }
// //     cb(JSON.parse(fileContent));
// //   });
// // };

// module.exports = class Product {
//   constructor(title, imageUrl, price, description, id = null) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//   }

//   // save() {
//   //   getProductsFromFile((products) => {
//   //     if (!this.id) {
//   //       this.id = Math.random().toString();
//   //       products.push(this);
//   //       fs.writeFile(p, JSON.stringify(products), (err) => {
//   //         console.log(err);
//   //       });
//   //     } else {
//   //       const existingProductIndex = products.findIndex(
//   //         (prod) => prod.id === this.id
//   //       );
//   //       const updatedProducts = [...products];
//   //       updatedProducts[existingProductIndex] = this;
//   //       fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//   //         console.log(err);
//   //       });
//   //     }
//   //   });
//   // }

//   save() {
//     return db.execute(
//       'INSERT INTO Products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//       [this.title, this.price, this.imageUrl, this.description]
//     );
//   }

//   // static fetchAll(cb) {
//   //   getProductsFromFile(cb);
//   // }

//   static fetchAll() {
//     return db.execute('SELECT * FROM Products');
//   }

//   // static findById(id, cb) {
//   //   getProductsFromFile((products) => {
//   //     const product = products.find((p) => p.id === id);
//   //     cb(product);
//   //   });
//   // }

//   static findById(id) {
//     return db.execute('SELECT * FROM Products WHERE products.id = ?', [id]);
//   }
//   // static deleteById(id) {
//   //   getProductsFromFile((products) => {
//   //     const product = products.find((prod) => prod.id === id);
//   //     const updatedProducts = products.filter((prod) => prod.id !== id);
//   //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//   //       if (!err) {
//   //         Cart.deleteProduct(id, product.price);
//   //       }
//   //     });
//   //   });
//   // }
// };

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
// });

const { getDb } = require('../util/database');
const { ObjectId } = require('mongodb');

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection('products')
      .insertOne({ ...this })
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((e) => console.log(e));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((e) => console.log(e));
  }
}

module.exports = Product;
