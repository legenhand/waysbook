'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // association has many to cart_item
      cart.belongsToMany(models.books, {
        as: "books",
        through: {
          model: "cart_item",
          as: "bridge"
        },
        foreignKey: "cart_id"
      });

      // belongs to users
      cart.belongsTo(models.users, {
        as: "cart",
        foreignKey: {
          name: "user_id"
        }
      })
    }
  }
  cart.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};