const { DataTypes } = require("sequelize");

const reviewSequelize = (sequelize) => {
  sequelize.Review = sequelize.define(
    "review",
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
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          max: 5, // only allow values <= 23
          min: 1,
        },
      },
      content: {
        type: DataTypes.STRING(200),
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      tableName: "review",
    }
  );
};

module.exports = reviewSequelize;
