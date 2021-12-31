const { DataTypes } = require("sequelize");

const userSequelize = (sequelize) => {
  sequelize.User = sequelize.define(
    "user",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        len: [4,50],
      },

      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      first_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        len: [2, 20],
      },

      last_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        len: [2,20],
      },

      address: {
        type: DataTypes.STRING(200),
      },

      avatar: {
        type: DataTypes.STRING(50),
      },

      password_hash: {
        type: DataTypes.STRING(100),
        allowNull: false,
        len: [50,100],
      },

      session_token: {
        type: DataTypes.STRING(150),
      },

      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        len: [8,50],
      },
      disabled: {
        type: DataTypes.TINYINT,
      },
      phone: {
        type: DataTypes.STRING(50),
        len: [9,50],
      },
 
      created_at: {
        type: DataTypes.DATE,
      }
    },
    {
      timestamps: true,
      updatedAt: false,
      createdAt: 'created_at',
      tableName: "user",
    }
  );
};

module.exports = userSequelize;
