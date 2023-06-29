// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
// });

// module.exports = pool.promise();

// const Sequelize = require('sequelize').Sequelize;

// const sequelize = new Sequelize(
//   'node-complete',
//   'root',
//   process.env.DB_PASSWORD,
//   {
//     dialect: 'mysql',
//     host: 'localhost',
//   }
// );

// module.exports = sequelize;

const { MongoClient } = require('mongodb');

let _db;

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dd2jder.mongodb.net/?retryWrites=true&dbName=shop&w=majority`;

const mongoConnect = (cb) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log('connected');
      _db = client.db();
      cb(client);
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
