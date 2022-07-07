'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // hasOne to models profile
      users.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser"
        }
      });

      // has many to models chats
      users.hasMany(models.chats, {
        as: "senderMessage",
        foreignKey: {
          name: "idSender"
        }
      });
      users.hasMany(models.chats, {
        as: "recipientMessage",
        foreignKey: {
          name: "idRecipient"
        }
      });

      users.hasMany(models.books, {
        as: "books",
        foreignKey : {
          name: "idUser"
        }
      });

      // has one to cart
      users.hasOne(models.cart, {
        as: "cart",
        foreignKey: {
          name: "user_id"
        }
      });

      // has many to transaction
      users.hasMany(models.transactions, {
        as: "transaction",
        foreignKey: {
          name: "idBuyer"
        }
      });
    }
  }
  users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};