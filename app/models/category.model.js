const { DataTypes } = require('sequelize');

const categorySequelize = ( sequelize ) => {
    sequelize.Category = sequelize.define('category', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true
        }, 
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }, 
        content: {
            type: DataTypes.STRING(200),
        }, 
        avatar: {
          type: DataTypes.STRING(200),
        },
    }, {
        timestamps: false,
        tableName: 'category'
    })
}

module.exports = categorySequelize;