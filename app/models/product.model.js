const { DataTypes } = require("sequelize");

const productSequelize = (sequelize) => {
  sequelize.Product = sequelize.define(
    "product",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
      },
      price: {
        type: DataTypes.DECIMAL(2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      public_for_sale: {
        type: DataTypes.TINYINT,
      },
      brand_id: {
        type: DataTypes.INTEGER,
      },
      starts_at: {
        type: DataTypes.DATE,
      },
      ends_at: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      tableName: "product",
    }
  );
};

module.exports = productSequelize;
