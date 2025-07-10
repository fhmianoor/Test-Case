'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Relasi: product milik user
      products.belongsTo(models.user, { foreignKey: 'userId' });
    }
  }

  products.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'products',
    tableName: 'products',
    timestamps: true
  });

  return products;
};
