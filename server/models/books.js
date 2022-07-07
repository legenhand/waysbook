'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      books.belongsTo(models.users, {
        as: "user",
        foreignKey: {
          name: "idUser"
        }
      })

      // belongs to many to cart item
      books.belongsToMany(models.cart, {
        as: "carts_item",
        through: {
          model: "cart_item",
          as: "bridge"
        },
        foreignKey: "book_id"
      });

      // belongs to many to transaction item
      books.belongsToMany(models.transactions, {
        as: "transactions",
        through: {
          model: "transaction_item",
          as: "bridge"
        },
        foreignKey: "book_id"
      });

    }
  }
  books.init({
    title: DataTypes.STRING,
    publication_date: DataTypes.STRING,
    pages: DataTypes.INTEGER,
    ISBN: DataTypes.STRING,
    author: DataTypes.STRING,
    price: DataTypes.INTEGER,
    desc: DataTypes.STRING,
    book_attachment: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'books',
  });
  return books;
};