const { DataTypes } = require("sequelize");

const cartItemSequelize = (sequelize) => {
  sequelize.CartItem = sequelize.define(
    "cart_item",
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      tableName: "cart_item",
    }
  );
};
module.exports = cartItemSequelize;