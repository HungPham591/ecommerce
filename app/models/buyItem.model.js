const { DataTypes } = require("sequelize");

const buyItemSequelize = (sequelize) => {
  sequelize.BuyItem = sequelize.define(
    "buy_item",
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
      buy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: false,
      tableName: "buy_item",
    }
  );
};
module.exports = buyItemSequelize;