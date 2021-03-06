'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile.belongsTo(models.users,{
        as: "user",
        foreignKey: {
          name: "idUser"
        }
      })
    }
  }
  profile.init({
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    location: DataTypes.STRING,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};