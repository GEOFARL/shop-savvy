// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize(
  'node-complete',
  'root',
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    host: 'localhost',
  }
);

module.exports = sequelize;
