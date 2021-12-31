const { DataTypes } = require("sequelize");

const productImageSequelize = (sequelize) => {
  sequelize.ProductImage = sequelize.define(
    "productImage",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      src: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
      },
      priority: {
        type: DataTypes.INTEGER,
      }
    },
    {
      timestamps: false,
      tableName: "product_image",
    }
  );
};

module.exports = productImageSequelize;
