'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Place.belongsTo(models.User, {
        foreignKey: {
          allowNull: true,
          name: 'host_id',
        },
      });
      models.Place.belongsTo(models.City, {
        foreignKey: {
          allowNull: true,
          name: 'city_id',
        },
      });
    }
  }
  Place.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      rooms: DataTypes.INTEGER,
      bathrooms: DataTypes.INTEGER,
      max_guests: DataTypes.INTEGER,
      price_by_night: DataTypes.FLOAT,
      city_id: DataTypes.INTEGER,
      host_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Place',
    }
  );
  return Place;
};
