const { DataTypes } = require("sequelize");

const roleSequelize = (sequelize) => {
  sequelize.Role = sequelize.define(
    "role",
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
      role_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(200),
      },
    },
    {
      timestamps: false,
      tableName: "role",
    }
  );
};

module.exports = roleSequelize;
