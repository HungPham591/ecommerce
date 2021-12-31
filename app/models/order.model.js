const { DataTypes } = require("sequelize");

const orderSequelize = (sequelize) => {
  sequelize.Order = sequelize.define(
    "order",
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
      sub_total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      tax: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      delivery_intended: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING(20),
      },
      delete_for_user: {
        type: DataTypes.TINYINT,
      },
      payment_id: {
        type: DataTypes.STRING,
      },
      full_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paid: {
        type: DataTypes.TINYINT,       
      },
      created_at:  {
        type: DataTypes.DATE
      }
    },
    {
      timestamps: false,
      tableName: "order",
    }
  );
};

module.exports = orderSequelize;
