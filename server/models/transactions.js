'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // belongs to many books
      transactions.belongsToMany(models.books, {
        as: "books",
        through: {
          model: "transaction_item",
          as: "bridge"
        },
        foreignKey: "transaction_id"
      });

      transactions.belongsTo(models.users, {
        as: "buyer",
        foreignKey: {
          name: "idBuyer"
        }
      })
    }
  }
  transactions.init({
    status: DataTypes.STRING,
    idBuyer: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};