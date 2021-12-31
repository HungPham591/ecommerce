const { DataTypes } = require("sequelize");

const supplierSequelize = (sequelize) => {
  sequelize.Supplier = sequelize.define(
    "supplier",
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
      avatar: {
        type: DataTypes.STRING(200),
      },
      address: {
        type: DataTypes.STRING(200),
      },
      description: {
        type: DataTypes.STRING(200),
      },
      phone: {
        len: [8, 11],
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "supplier",
    }
  );
};

module.exports = supplierSequelize;
