const { DataTypes } = require("sequelize");

const orderItemSequelize = (sequelize) => {
  sequelize.OrderItem = sequelize.define(
    "orderItem",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
      tableName: "order_item",
    }
  );
};

module.exports = orderItemSequelize;
