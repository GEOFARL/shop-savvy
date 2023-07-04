// const sequelize = require('../util/database');
// const Sequelize = require('sequelize').Sequelize;

const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

// const User = sequelize.define('User', {
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },
// });

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .findOneAndUpdate(
        { name: this.name },
        { $set: { ...this } },
        { upsert: true }
      )
      .catch((e) => console.log(e));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new ObjectId(userId) })
      .next();
  }
}

module.exports = User;
