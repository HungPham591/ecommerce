const { DataTypes } = require("sequelize");

const buySequelize = (sequelize) => {
  sequelize.Buy = sequelize.define(
    "buy",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      tableName: "buy",
    }
  );
};
module.exports = buySequelize;